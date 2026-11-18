#include "taz/persist.hpp"
#include "taz/crypto.hpp"
#include "taz/export.hpp"
#include <algorithm>
#include <atomic>
#include <cstdio>
#include <chrono>
#include <filesystem>
#include <fstream>
#include <map>
#include <cerrno>
#include <cstring>
#include <stdexcept>
#include <tuple>
#include <utility>

#ifndef _WIN32
#include <fcntl.h>
#include <unistd.h>
#else
#ifndef NOMINMAX
#define NOMINMAX
#endif
#include <windows.h>
#endif

namespace taz {
namespace {

struct LoadError : std::runtime_error { using std::runtime_error::runtime_error; };
[[noreturn]] void fail(const std::string& msg) { throw LoadError(msg); }

// ----------------------------------------------------------------------------------------------
// A deliberately small and strict JSON reader. The chain file only ever contains objects, arrays and
// strings (every number is a decimal string), so nothing else is accepted: no numbers, true, false, null,
// comments, trailing commas, duplicate keys, escape sequences, control characters or non-ASCII bytes.
// ----------------------------------------------------------------------------------------------
struct JVal {
    enum class Type { Obj, Arr, Str } type{Type::Str};
    std::string str;
    std::string key;   // set only for a member of an object (see obj below)
    std::vector<JVal> arr;
    // v8.3: an object's members are stored as JVal with `key` set, not as std::pair<std::string, JVal>.
    // A vector of pairs needs a complete element type when it is instantiated, and clang refuses JVal
    // there (GCC accepts it) — which is why the clang-built fuzz job could not compile the library at all.
    std::vector<JVal> obj;
};

// v8.11: delete a file named by a UTF-8 path. std::remove() takes a narrow path, which on Windows goes
// through the ANSI code page, so a temporary file under a non-ASCII directory survived every error path in
// save_chain_json. std::filesystem::remove() uses the wide API there.
void remove_file_utf8(const std::string& path) noexcept {
    try {
        std::error_code ec;
        std::filesystem::remove(path_from_utf8(path), ec);   // a failure here is not worth reporting
    } catch (...) {
    }
}

// v8.3: a UTF-8 path without std::filesystem::u8path, which is deprecated in C++20 (clang warns).
std::filesystem::path path_from_utf8(const std::string& s) {
    return std::filesystem::path(std::u8string(s.begin(), s.end()));
}

// v8.7: a crash between writing the temporary file and renaming it leaves <path>.tmp.<pid>.<n> behind for
// ever. Sweep the ones in this directory that look exactly like ours and are more than an hour old.
// Best effort on purpose: it never fails a save, never follows a symlink and never touches another file.
void sweep_stale_temp_files(const std::string& path) noexcept {
    // v8.11: the try starts at the very first statement. path_from_utf8() allocates a std::filesystem::path
    // and converts UTF-8 on Windows, and filename().string() allocates too. Both used to sit OUTSIDE the try,
    // and because this function is noexcept, a bad_alloc or a filesystem_error there called std::terminate —
    // the opposite of what "housekeeping never breaks a save" is supposed to mean.
    try {
    namespace fs = std::filesystem;
    std::error_code ec;
    const fs::path target = path_from_utf8(path);
    const fs::path dir = target.has_parent_path() ? target.parent_path() : fs::path(".");
    const std::string prefix = target.filename().string() + ".tmp.";
    const auto cutoff = fs::file_time_type::clock::now() - std::chrono::hours(1);
    for (fs::directory_iterator it(dir, ec), end; !ec && it != end; it.increment(ec)) {
        const std::string name = it->path().filename().string();
        if (name.size() <= prefix.size() || name.compare(0, prefix.size(), prefix) != 0) continue;
        std::error_code fec;
        if (!fs::is_regular_file(it->path(), fec) || fec) continue;
        const auto written = fs::last_write_time(it->path(), fec);
        if (fec || written > cutoff) continue;          // younger than an hour: another process may be writing it
        std::error_code rec;
        fs::remove(it->path(), rec);                    // ignored: a stale file we cannot delete is not a failure
    }
    } catch (...) {
        // A stale file that survives is not an error. Never propagate anything from here.
    }
}

class Parser {
public:
    Parser(std::string_view text, std::uint64_t max_nodes) : t_(text), max_nodes_(max_nodes) {}
    JVal parse_document() {
        if (t_.size() >= 3 && static_cast<unsigned char>(t_[0]) == 0xEF && static_cast<unsigned char>(t_[1]) == 0xBB && static_cast<unsigned char>(t_[2]) == 0xBF)
            fail("the file starts with a byte-order mark; it must be plain ASCII JSON");
        ws();
        JVal v = value(0);
        ws();
        if (pos_ != t_.size()) err("unexpected data after the end of the JSON document");
        return v;
    }
private:
    static constexpr int MAX_DEPTH = 12;
    static constexpr std::size_t MAX_STRING = 4096, MAX_MEMBERS = 64;
    std::string_view t_; std::size_t pos_{0}; std::uint64_t nodes_{0}, max_nodes_;
    [[noreturn]] void err(const std::string& m) const { fail(m + " (at byte " + std::to_string(pos_) + ")"); }
    void ws() { while (pos_ < t_.size() && (t_[pos_] == ' ' || t_[pos_] == '\n' || t_[pos_] == '\r' || t_[pos_] == '\t')) ++pos_; }
    char peek() const { if (pos_ >= t_.size()) fail("the file ends too early (cut short?)"); return t_[pos_]; }
    void count_node() { if (++nodes_ > max_nodes_) fail("the file holds too many JSON values"); }
    JVal value(int depth) {
        if (depth > MAX_DEPTH) err("JSON is nested too deeply");
        count_node();
        const char c = peek();
        if (c == '{') return object(depth);
        if (c == '[') return array(depth);
        if (c == '"') { JVal v; v.type = JVal::Type::Str; v.str = string(); return v; }
        err("only objects, arrays and strings are allowed in a chain file");
    }
    std::string string() {
        ++pos_; // opening quote
        std::string s;
        for (;;) {
            const char c = peek(); ++pos_;
            if (c == '"') return s;
            const auto u = static_cast<unsigned char>(c);
            if (c == '\\') err("escape sequences are not allowed in a chain file");
            if (u < 0x20 || u > 0x7e) err("only printable ASCII is allowed inside strings");
            if (s.size() >= MAX_STRING) err("string is too long");
            s.push_back(c);
        }
    }
    JVal array(int depth) {
        JVal v; v.type = JVal::Type::Arr; ++pos_; ws();
        if (peek() == ']') { ++pos_; return v; }
        for (;;) {
            ws(); v.arr.push_back(value(depth + 1)); ws();
            const char c = peek(); ++pos_;
            if (c == ']') return v;
            if (c != ',') { --pos_; err("expected ',' or ']'"); }
        }
    }
    JVal object(int depth) {
        JVal v; v.type = JVal::Type::Obj; ++pos_; ws();
        if (peek() == '}') { ++pos_; return v; }
        for (;;) {
            ws();
            if (peek() != '"') err("expected a quoted key");
            count_node();
            std::string key = string();
            for (const auto& m : v.obj) if (m.key == key) err("duplicate key \"" + key + "\"");
            if (v.obj.size() >= MAX_MEMBERS) err("object has too many members");
            ws();
            if (peek() != ':') err("expected ':'");
            ++pos_; ws();
            JVal member = value(depth + 1); member.key = std::move(key); v.obj.push_back(std::move(member)); ws();
            const char c = peek(); ++pos_;
            if (c == '}') return v;
            if (c != ',') { --pos_; err("expected ',' or '}'"); }
        }
    }
};

// ----------------------------------------------------------------------------------------------
// Strict, typed access. Every key set must match exactly; every number must be canonical.
// ----------------------------------------------------------------------------------------------
const JVal* find(const JVal& o, std::string_view key) {
    for (const auto& m : o.obj) if (m.key == key) return &m;
    return nullptr;
}
const JVal& obj_of(const JVal& v, std::string_view what) { if (v.type != JVal::Type::Obj) fail(std::string(what) + " must be an object"); return v; }
const JVal& arr_of(const JVal& v, std::string_view what) { if (v.type != JVal::Type::Arr) fail(std::string(what) + " must be an array"); return v; }
const std::string& str_of(const JVal& v, std::string_view what) { if (v.type != JVal::Type::Str) fail(std::string(what) + " must be a string"); return v.str; }
// The object must have exactly these keys (no more, no fewer).
void exact_keys(const JVal& o, std::initializer_list<std::string_view> keys, const std::string& what) {
    for (std::string_view k : keys) if (!find(o, k)) fail(what + " is missing the field \"" + std::string(k) + "\"");
    if (o.obj.size() != keys.size()) {
        for (const auto& m : o.obj) if (std::find(keys.begin(), keys.end(), m.key) == keys.end()) fail(what + " has an unknown field \"" + m.key + "\"");
    }
}
const JVal& field(const JVal& o, std::string_view key) { return *find(o, key); }

std::uint64_t dec_u64(const JVal& v, const std::string& what) {
    const std::string& s = str_of(v, what);
    if (s.empty() || s.size() > 20) fail(what + " is not a valid decimal number");
    if (s.size() > 1 && s[0] == '0') fail(what + " has a leading zero");
    std::uint64_t r = 0;
    for (char c : s) {
        if (c < '0' || c > '9') fail(what + " is not a valid decimal number");
        const auto d = static_cast<std::uint64_t>(c - '0');
        if (r > (UINT64_MAX - d) / 10) fail(what + " does not fit in 64 bits");
        r = r * 10 + d;
    }
    return r;
}
std::int64_t dec_i64(const JVal& v, const std::string& what) {
    const std::string& s = str_of(v, what);
    const bool neg = !s.empty() && s[0] == '-';
    JVal digits; digits.type = JVal::Type::Str; digits.str = neg ? s.substr(1) : s;
    const std::uint64_t mag = dec_u64(digits, what);
    if (neg) { if (mag == 0 || mag > (1ull << 63)) fail(what + " is out of range"); return mag == (1ull << 63) ? INT64_MIN : -static_cast<std::int64_t>(mag); }
    if (mag > static_cast<std::uint64_t>(INT64_MAX)) fail(what + " is out of range");
    return static_cast<std::int64_t>(mag);
}
template <class T> T hex_of(const JVal& v, const std::string& what) {
    constexpr std::size_t N = std::tuple_size<T>::value;
    const std::string& s = str_of(v, what);
    if (s.size() != 2 * N) fail(what + " must be exactly " + std::to_string(2 * N) + " hex characters");
    T out{};
    auto nib = [&](char c) -> unsigned {
        if (c >= '0' && c <= '9') return static_cast<unsigned>(c - '0');
        if (c >= 'a' && c <= 'f') return static_cast<unsigned>(c - 'a' + 10);
        fail(what + " must be lowercase hex");
    };
    for (std::size_t i = 0; i < N; ++i) out[i] = static_cast<std::uint8_t>((nib(s[2 * i]) << 4) | nib(s[2 * i + 1]));
    return out;
}
template <class T> bool is_zero(const T& a) { return std::all_of(a.begin(), a.end(), [](std::uint8_t b) { return b == 0; }); }

constexpr std::string_view FORMAT_PREFIX = "tazvera-chain-export-";

Transaction parse_tx(const JVal& jv, bool with_veto, const std::string& where) {
    const JVal& o = obj_of(jv, where);
    if (with_veto) exact_keys(o, {"txid", "protocol_version", "chain_id", "kind", "from", "to", "amount", "fee", "nonce", "expiry_height", "daily_limit",
                                  "hold_threshold", "hold_blocks", "ref", "new_owner", "veto", "guardian_threshold", "guardians", "pubkey", "signature"}, where);
    else exact_keys(o, {"txid", "protocol_version", "chain_id", "kind", "from", "to", "amount", "fee", "nonce", "expiry_height", "daily_limit",
                        "hold_threshold", "hold_blocks", "ref", "new_owner", "guardian_threshold", "guardians", "pubkey", "signature"}, where);
    Transaction tx;
    const std::uint64_t pv = dec_u64(field(o, "protocol_version"), where + ".protocol_version");
    if (pv != PROTOCOL_VERSION) fail(where + " has an unsupported protocol version");
    tx.protocol_version = static_cast<std::uint32_t>(pv);
    tx.chain_id = str_of(field(o, "chain_id"), where + ".chain_id");
    const std::uint64_t kind = dec_u64(field(o, "kind"), where + ".kind");
    if (kind > static_cast<std::uint64_t>(TxKind::RecoveryCancel)) fail(where + " has an unknown transaction kind");
    tx.kind = static_cast<TxKind>(kind);
    tx.from = hex_of<Address>(field(o, "from"), where + ".from");
    tx.to = hex_of<Address>(field(o, "to"), where + ".to");
    tx.amount = dec_u64(field(o, "amount"), where + ".amount");
    tx.fee = dec_u64(field(o, "fee"), where + ".fee");
    tx.nonce = dec_u64(field(o, "nonce"), where + ".nonce");
    tx.expiry_height = dec_u64(field(o, "expiry_height"), where + ".expiry_height");
    tx.daily_limit = dec_u64(field(o, "daily_limit"), where + ".daily_limit");
    tx.hold_threshold = dec_u64(field(o, "hold_threshold"), where + ".hold_threshold");
    tx.hold_blocks = dec_u64(field(o, "hold_blocks"), where + ".hold_blocks");
    tx.ref = hex_of<Hash32>(field(o, "ref"), where + ".ref");
    tx.new_owner = hex_of<Address>(field(o, "new_owner"), where + ".new_owner");
    if (with_veto) tx.veto = hex_of<Address>(field(o, "veto"), where + ".veto");
    tx.guardian_threshold = dec_u64(field(o, "guardian_threshold"), where + ".guardian_threshold");
    const JVal& g = arr_of(field(o, "guardians"), where + ".guardians");
    if (g.arr.size() > 64) fail(where + " lists too many guardians");
    for (std::size_t i = 0; i < g.arr.size(); ++i) tx.guardians.push_back(hex_of<Address>(g.arr[i], where + ".guardians[" + std::to_string(i) + "]"));
    tx.pubkey = hex_of<PubKey>(field(o, "pubkey"), where + ".pubkey");
    tx.signature = hex_of<Signature>(field(o, "signature"), where + ".signature");
    if (hex_of<Hash32>(field(o, "txid"), where + ".txid") != tx.txid()) fail(where + ": txid does not match the transaction contents (data was changed)");
    return tx;
}

Block parse_block(const JVal& jv, bool with_veto, const std::string& where) {
    const JVal& o = obj_of(jv, where);
    exact_keys(o, {"height", "protocol_version", "chain_id", "previous_hash", "timestamp", "state_root", "hash", "transactions"}, where);
    Block b;
    b.height = dec_u64(field(o, "height"), where + ".height");
    const std::uint64_t pv = dec_u64(field(o, "protocol_version"), where + ".protocol_version");
    if (pv != PROTOCOL_VERSION) fail(where + " has an unsupported protocol version");
    b.protocol_version = static_cast<std::uint32_t>(pv);
    b.chain_id = str_of(field(o, "chain_id"), where + ".chain_id");
    b.previous_hash = hex_of<Hash32>(field(o, "previous_hash"), where + ".previous_hash");
    b.timestamp = dec_i64(field(o, "timestamp"), where + ".timestamp");
    b.state_root = hex_of<Hash32>(field(o, "state_root"), where + ".state_root");
    const JVal& txs = arr_of(field(o, "transactions"), where + ".transactions");
    if (txs.arr.size() > MAX_BLOCK_TXS) fail(where + " has too many transactions");
    for (std::size_t i = 0; i < txs.arr.size(); ++i) b.transactions.push_back(parse_tx(txs.arr[i], with_veto, where + " tx " + std::to_string(i)));
    if (hex_of<Hash32>(field(o, "hash"), where + ".hash") != b.hash()) fail(where + ": block hash does not match the block contents (data was changed)");
    return b;
}

int level_of(const Chain& c) {
    int level = 1;
    for (const Block& b : c.blocks()) for (const Transaction& tx : b.transactions) {
        if (tx.kind >= TxKind::SetGuardians) level = 4; else if (tx.kind != TxKind::Transfer && level < 2) level = 2;
    }
    return level;
}

void load_document(std::string_view text, Chain& result, const LoadOptions& opt) {
    Parser parser(text, opt.max_nodes);
    const JVal root = parser.parse_document();
    const JVal& r = obj_of(root, "the file");
    exact_keys(r, {"format", "chain_id", "protocol_version", "genesis_commitment", "params", "genesis_balances", "blocks"}, "the file");

    // ---- version / format ----
    const std::string& format = str_of(field(r, "format"), "format");
    if (format.rfind(FORMAT_PREFIX, 0) != 0) fail("this is not a TAZVERA chain file (unknown \"format\")");
    const std::string tag = format.substr(FORMAT_PREFIX.size());
    int declared_level = 0; bool expects_veto = true;
    if (tag == "v1") { declared_level = 1; expects_veto = false; }          // plain transfers; Core v6 files omit the veto key
    else if (tag == "v2") { declared_level = 2; expects_veto = false; }     // safety rules; same
    else if (tag == "v4") declared_level = 4;
    else if (tag == "v3") declared_level = 4;                               // v7 label before "-v4" existed; checked below
    else fail("unsupported chain file format \"" + format + "\" (this build reads v1, v2 and v4)");

    if (str_of(field(r, "chain_id"), "chain_id") != CHAIN_ID) fail("the file belongs to a different chain (chain ID differs)");
    const std::uint64_t file_proto = dec_u64(field(r, "protocol_version"), "protocol_version");
    if (file_proto != PROTOCOL_VERSION) {
        if (file_proto < PROTOCOL_VERSION)
            fail("chain file protocol_version is older than this build (v8.2 requires protocol 2; re-export after upgrade or use a matching binary)");
        fail("unsupported protocol version");
    }

    const JVal& p = obj_of(field(r, "params"), "params");
    exact_keys(p, {"fee_transfer_v1", "max_block_txs", "limit_window_blocks", "max_hold_blocks", "safety_delay_blocks", "max_guardians", "recovery_delay_blocks"}, "params");
    const std::pair<const char*, std::uint64_t> expected[] = {
        {"fee_transfer_v1", FEE_TRANSFER_V1}, {"max_block_txs", MAX_BLOCK_TXS}, {"limit_window_blocks", LIMIT_WINDOW_BLOCKS},
        {"max_hold_blocks", MAX_HOLD_BLOCKS}, {"safety_delay_blocks", SAFETY_DELAY_BLOCKS}, {"max_guardians", MAX_GUARDIANS},
        {"recovery_delay_blocks", RECOVERY_DELAY_BLOCKS}};
    for (const auto& [name, value] : expected)
        if (dec_u64(field(p, name), std::string("params.") + name) != value) fail(std::string("parameter ") + name + " differs from this build, so the chain cannot be verified here");

    // ---- which transaction layout does this file use? (veto key present or not) ----
    const JVal& blocks = arr_of(field(r, "blocks"), "blocks");
    if (blocks.arr.size() > opt.max_blocks) fail("the file holds more blocks than this loader allows");
    bool saw_tx = false, any_with_veto = false, any_without_veto = false;
    for (const JVal& b : blocks.arr) {
        if (b.type != JVal::Type::Obj) continue;
        const JVal* txs = find(b, "transactions");
        if (!txs || txs->type != JVal::Type::Arr) continue;
        for (const JVal& t : txs->arr) {
            if (t.type != JVal::Type::Obj) continue;
            saw_tx = true;
            (find(t, "veto") ? any_with_veto : any_without_veto) = true;
        }
    }
    (void)saw_tx;
    if (any_with_veto && any_without_veto) fail("transactions in this file use two different layouts");
    if (tag == "v3" && any_without_veto)
        fail("this is a Core v6 file (format v3): guardian recovery WITHOUT a veto key. Its signatures and state roots follow older rules, "
             "so Core v7 and later cannot verify it. Chains written before the veto key existed cannot be loaded.");
    // v1/v2 files may or may not carry the veto field: Core v6 omitted it, Core v7 and later always write it (value zero when unused).
    if (expects_veto && any_without_veto) fail("format " + tag + " requires the veto field in every transaction (this looks like an older layout)");
    const bool with_veto = any_with_veto;

    // ---- genesis ----
    const JVal& gb = arr_of(field(r, "genesis_balances"), "genesis_balances");
    if (gb.arr.size() == 1) fail("genesis_balances lists one account: a file written by Core v7 or older; Core v8 files list both genesis accounts, please re-export it");
    if (gb.arr.size() != 2) fail("genesis_balances must list exactly 2 accounts");
    std::vector<std::pair<Address, Amount>> genesis;
    for (std::size_t i = 0; i < gb.arr.size(); ++i) {
        const std::string w = "genesis_balances[" + std::to_string(i) + "]";
        const JVal& e = obj_of(gb.arr[i], w);
        exact_keys(e, {"address", "balance"}, w);
        const Amount bal = dec_u64(field(e, "balance"), w + ".balance");
        genesis.emplace_back(hex_of<Address>(field(e, "address"), w + ".address"), bal);
    }
    if (genesis[0].first == genesis[1].first) fail("genesis_balances lists the same address twice");
    Chain chain;
    if (!chain.init_genesis(genesis[0].first, genesis[0].second, genesis[1].first, genesis[1].second)) fail("genesis could not be created");
    if (chain.genesis_balances() != genesis) fail("genesis balances do not match");
    // Independent commitment: must match balances (and match file if the field is present).
    const Hash32 expect_c = chain.genesis_commitment();
    if (!find(r, "genesis_commitment")) fail("genesis_commitment is required for protocol 2 chain files");
    {
        const Hash32 file_c = hex_of<Hash32>(field(r, "genesis_commitment"), "genesis_commitment");
        if (file_c != expect_c) fail("genesis_commitment does not match genesis_balances");
    }
    // v8.3: the commitment above only proves the file agrees with itself. If the caller knows which chain it
    // meant to join, compare against that value too — a different genesis is a different chain, however
    // consistent it looks.
    if (opt.expected_genesis_commitment && *opt.expected_genesis_commitment != expect_c)
        fail("the genesis commitment does not match the value pinned for this chain (wrong chain, or a rebuilt genesis)");
    // v8.8: preparation for the node, which must never load a chain it cannot identify. The flag is off by
    // default so no existing caller changes behaviour; the node will set it.
    if (opt.require_genesis_pin && !opt.expected_genesis_commitment)
        fail("this build requires a pinned genesis commitment: set LoadOptions::expected_genesis_commitment");

    // ---- blocks: block 0 must equal the genesis we just rebuilt; every other block is replayed ----
    if (blocks.arr.empty()) fail("blocks is empty (the genesis block is missing)");
    const Block g = parse_block(blocks.arr[0], with_veto, "block 0");
    const Block& mine = chain.blocks()[0];
    if (g.height != 0 || !g.transactions.empty() || g.timestamp != 0 || g.previous_hash != mine.previous_hash || g.protocol_version != mine.protocol_version ||
        g.chain_id != mine.chain_id)
        fail("block 0 is not a valid genesis block");
    if (g.state_root != mine.state_root) fail("block 0: genesis state root does not match the genesis balances");
    if (g.hash() != mine.hash()) fail("block 0: genesis hash does not match the genesis commitment");
    for (std::size_t i = 1; i < blocks.arr.size(); ++i) {
        const Block b = parse_block(blocks.arr[i], with_veto, "block " + std::to_string(i));
        const ChainResult res = chain.accept_block(b);
        if (!res.ok) fail("block " + std::to_string(i) + " (height " + std::to_string(b.height) + ") is invalid: " + res.error);
    }
    if (level_of(chain) != declared_level)
        fail("the file's format label (" + tag + ") does not match what the chain contains");
    result = std::move(chain);
}

std::string errno_text(const char* what) { return std::string(what) + ": " + std::strerror(errno); }

}  // namespace

bool load_chain_json_text(std::string_view text, Chain& out, std::string* error, const LoadOptions& options) {
    try {
        if (text.size() > options.max_file_bytes) fail("the file is larger than the allowed size");
        Chain loaded;
        load_document(text, loaded, options);
        out = std::move(loaded);
        return true;
    } catch (const LoadError& e) {
        if (error) *error = e.what();
    } catch (const std::exception& e) {
        if (error) *error = std::string("could not load chain: ") + e.what();
    }
    return false;
}

bool load_chain_json(const std::string& path, Chain& out, std::string* error, const LoadOptions& options) {
    try {
        std::error_code ec;
        // v8.8: one UTF-8 to native conversion for every filesystem call below. status(), file_size() and
        // ifstream each took a narrow std::string, which on Windows goes through the ANSI code page, so a
        // chain file under a non-ASCII directory could not be opened even though saving it worked (v8.3).
        const std::filesystem::path file = path_from_utf8(path);
        const auto status = std::filesystem::status(file, ec);
        if (ec || !std::filesystem::is_regular_file(status)) { if (error) *error = "not a readable regular file: " + path; return false; }
        const std::uintmax_t size = std::filesystem::file_size(file, ec);
        if (ec) { if (error) *error = "could not read the file size"; return false; }
        if (size > options.max_file_bytes) { if (error) *error = "the file is larger than the allowed size"; return false; }
        std::ifstream in(file, std::ios::binary);
        if (!in) { if (error) *error = "could not open the file"; return false; }
        std::string text(static_cast<std::size_t>(size), '\0');
        in.read(text.data(), static_cast<std::streamsize>(size));
        if (static_cast<std::uintmax_t>(in.gcount()) != size) { if (error) *error = "could not read the whole file"; return false; }
        return load_chain_json_text(text, out, error, options);
    } catch (const std::exception& e) {
        if (error) *error = std::string("could not load chain: ") + e.what();
        return false;
    }
}

bool save_chain_json(const Chain& chain, const std::string& path, std::string* error) {
    auto set_err = [&](const std::string& m) { if (error) *error = m; };
    if (chain.blocks().empty()) { set_err("the chain has no genesis; nothing to save"); return false; }
    static std::atomic<unsigned long> counter{0};
    std::string tmp;
    try {
        // v8.9: inside the try, and the helper is noexcept, so no filesystem error can escape save_chain_json.
        sweep_stale_temp_files(path);   // housekeeping only, never fatal
        const std::string body = to_json(chain);
        namespace fs = std::filesystem;
#ifndef _WIN32
        const std::string id = std::to_string(static_cast<long>(::getpid())) + "." + std::to_string(counter.fetch_add(1));
#else
        const std::string id = std::to_string(static_cast<unsigned long>(::GetCurrentProcessId())) + "." + std::to_string(counter.fetch_add(1));
#endif
        tmp = path + ".tmp." + id; // unique per process and per call, so two saves never share a file
#ifndef _WIN32
        {
            const int fd = ::open(tmp.c_str(), O_WRONLY | O_CREAT | O_EXCL | O_CLOEXEC, 0644);
            if (fd < 0) { set_err(errno_text("could not create the temporary file")); return false; }
            std::size_t done = 0; bool ok = true;
            while (done < body.size()) {
                const ssize_t n = ::write(fd, body.data() + done, body.size() - done);
                if (n < 0) { if (errno == EINTR) continue; ok = false; break; }
                done += static_cast<std::size_t>(n);
            }
            if (ok && ::fsync(fd) != 0) ok = false;
            const int saved = errno;
            ::close(fd);
            if (!ok) { errno = saved; set_err(errno_text("could not write the temporary file")); ::unlink(tmp.c_str()); return false; }
        }
#else
        { // v8.2: real Win32 calls so the data is flushed to disk (FlushFileBuffers) before the replace
            const std::wstring wtmp = path_from_utf8(tmp).wstring();
            HANDLE h = ::CreateFileW(wtmp.c_str(), GENERIC_WRITE, 0, nullptr, CREATE_NEW, FILE_ATTRIBUTE_NORMAL, nullptr);
            if (h == INVALID_HANDLE_VALUE) { set_err("could not create the temporary file (Windows error " + std::to_string(::GetLastError()) + ")"); return false; }
            bool ok = true; std::size_t done = 0;
            while (done < body.size()) {
                const DWORD chunk = static_cast<DWORD>(std::min<std::size_t>(body.size() - done, 1u << 20)); DWORD wrote = 0;
                if (!::WriteFile(h, body.data() + done, chunk, &wrote, nullptr) || wrote == 0) { ok = false; break; }
                done += wrote;
            }
            if (ok && !::FlushFileBuffers(h)) ok = false;
            ::CloseHandle(h);
            if (!ok) { set_err("could not write the temporary file"); ::DeleteFileW(wtmp.c_str()); return false; }
        }
#endif
        { // read it back: what is on disk must be exactly what we meant to write
            // v8.3: path_from_utf8, so a target under a non-ASCII directory works on Windows too (the narrow
            // std::ifstream constructor goes through the ANSI code page there).
            std::ifstream in(path_from_utf8(tmp), std::ios::binary);
            std::string back((std::istreambuf_iterator<char>(in)), std::istreambuf_iterator<char>());
            if (back != body) { set_err("the temporary file does not match what was written"); remove_file_utf8(tmp); return false; }
        }
        if (testing::persist_stop_before_rename) { set_err("stopped before rename (test)"); return false; } // leaves tmp behind, like a crash
#ifndef _WIN32
        std::error_code ec;
        fs::rename(tmp, path, ec); // atomic replace on POSIX
        if (ec) { set_err("could not replace the chain file: " + ec.message()); remove_file_utf8(tmp); return false; }
#else
        // v8.3: the replace can fail for a few milliseconds while another process holds the target open
        // (antivirus, the search indexer, a reader). Retry the sharing/access errors before giving up; a
        // single-shot MoveFileExW made the concurrent-save test flaky on the Windows runner.
        bool replaced = false; DWORD last = 0;
        for (int attempt = 0; attempt < 10 && !replaced; ++attempt) {
            if (::MoveFileExW(path_from_utf8(tmp).wstring().c_str(), path_from_utf8(path).wstring().c_str(),
                              MOVEFILE_REPLACE_EXISTING | MOVEFILE_WRITE_THROUGH)) { replaced = true; break; }
            last = ::GetLastError();
            if (last != ERROR_ACCESS_DENIED && last != ERROR_SHARING_VIOLATION && last != ERROR_LOCK_VIOLATION) break;
            ::Sleep(static_cast<DWORD>(10 * (attempt + 1)));
        }
        if (!replaced) {
            set_err("could not replace the chain file (Windows error " + std::to_string(last) + ")");
            ::DeleteFileW(path_from_utf8(tmp).wstring().c_str()); return false;
        }
#endif
#ifndef _WIN32
        { // make the rename itself durable
            fs::path dir = fs::path(path).parent_path();
            if (dir.empty()) dir = ".";
            const int dfd = ::open(dir.c_str(), O_RDONLY | O_DIRECTORY | O_CLOEXEC);
            if (dfd >= 0) { ::fsync(dfd); ::close(dfd); }
        }
#endif
        return true;
    } catch (const std::exception& e) {
        set_err(e.what());
        if (!tmp.empty()) remove_file_utf8(tmp);
        return false;
    }
}

}  // namespace taz
