// Persistence tests. Every numbered section below checks one requirement on its own:
//  1 save   2 load   3 strict JSON   4 replay from genesis   5 hash/signature/chain-id/state-root checks
//  6 incomplete or wrong files   7 crash-safe atomic save   8 restart gives the same chain
//  9 wrong version / changed data   10 random damage never produces a different accepted chain
#include "taz/chain.hpp"
#include "taz/crypto.hpp"
#include "taz/export.hpp"
#include "taz/persist.hpp"
#include <algorithm>
#include <chrono>
#include <cstdlib>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <regex>
#include <thread>
using namespace taz;
namespace fs = std::filesystem;
static int failures = 0;
#define CHECK(x) do { if(!(x)){ std::cerr << "FAIL line " << __LINE__ << ": " #x "\n"; ++failures; } } while(0)

struct Key { PrivKey sk{}; PubKey pk{}; Address addr{}; };
static Key new_key() { Key k; CHECK(generate_keypair(k.sk, k.pk)); k.addr = address_from_pubkey(k.pk); return k; }
static void resign(Transaction& tx, const Key& k) { CHECK(sign(k.sk, tx.signable_bytes(), tx.signature)); }
static Transaction base(const Key& f, std::uint64_t n) { Transaction tx; tx.from = f.addr; tx.nonce = n; tx.pubkey = f.pk; return tx; }
static Transaction transfer(const Key& f, const Address& to, Amount a, std::uint64_t n) { Transaction tx = base(f, n); tx.to = to; tx.amount = a; resign(tx, f); return tx; }
static Transaction safety(const Key& f, Amount limit, Amount thr, std::uint64_t hold, std::uint64_t n) {
    Transaction tx = base(f, n); tx.kind = TxKind::SetSafety; tx.daily_limit = limit; tx.hold_threshold = thr; tx.hold_blocks = hold; resign(tx, f); return tx;
}
static Transaction setg(const Key& f, std::vector<Address> l, std::uint64_t thr, const Address& veto, std::uint64_t n) {
    std::sort(l.begin(), l.end()); Transaction tx = base(f, n); tx.kind = TxKind::SetGuardians; tx.guardians = l; tx.guardian_threshold = thr; tx.veto = veto; resign(tx, f); return tx;
}
static Transaction vote(const Key& g, const Address& who, const Address& to, std::uint64_t n) {
    Transaction tx = base(g, n); tx.kind = TxKind::RecoveryVote; tx.to = who; tx.new_owner = to; resign(tx, g); return tx;
}
static Transaction vcancel(const Key& v, const Address& who, std::uint64_t n) { Transaction tx = base(v, n); tx.kind = TxKind::RecoveryCancel; tx.to = who; resign(tx, v); return tx; }

static std::int64_t g_ts = 100;
static bool put(Chain& c, std::vector<Transaction> txs) { return c.append_block(txs, g_ts++).ok; }
static void empty_until(Chain& c, std::uint64_t h) { while (c.height() < h) CHECK(put(c, {})); }
static std::uint64_t nx(const Chain& c, const Key& k) { return c.state().nonce(k.addr); }

static bool same_chain(const Chain& a, const Chain& b) {
    if (a.blocks().size() != b.blocks().size() || a.genesis_balances() != b.genesis_balances()) return false;
    for (std::size_t i = 0; i < a.blocks().size(); ++i) if (a.blocks()[i].hash() != b.blocks()[i].hash()) return false;
    return a.state().state_root() == b.state().state_root() && a.height() == b.height() && to_json(a) == to_json(b);
}

// v8.2: block 0 commits to BOTH genesis accounts (zero balances included), so any accepted file must be exactly the same chain.
struct Keys { Key o = new_key(), g0 = new_key(), g1 = new_key(), g2 = new_key(), v = new_key(), n = new_key(), x = new_key(); };
// A chain that uses every feature: plain transfers, safety rules with a held transfer, guardians with a veto
// key, votes, a veto cancel and a recovery that really completes. `mid` receives copies taken along the way.
static Chain full_chain(const Keys& k, std::vector<Chain>* mid = nullptr) {
    Chain c; CHECK(c.init_genesis(k.o.addr, 100000000, k.g0.addr, 5000000));
    auto snap = [&] { if (mid) mid->push_back(c); };
    CHECK(put(c, {transfer(k.o, k.g1.addr, 2000000, 0), transfer(k.o, k.g2.addr, 2000000, 1), transfer(k.o, k.x.addr, 2000000, 2), transfer(k.o, k.v.addr, 1000000, 3)})); snap();
    CHECK(put(c, {safety(k.o, 0, 500000, 10, 4)})); CHECK(put(c, {transfer(k.o, k.x.addr, 600000, 5)})); snap(); // a transfer is being held here
    empty_until(c, c.height() + 11); snap();
    CHECK(put(c, {setg(k.o, {k.g0.addr, k.g1.addr, k.g2.addr}, 2, k.v.addr, 6)})); snap();
    CHECK(put(c, {vote(k.g0, k.o.addr, k.n.addr, 0), vote(k.g1, k.o.addr, k.n.addr, 0)})); snap(); // recovery waiting
    CHECK(put(c, {vcancel(k.v, k.o.addr, 0)})); snap(); // R2: postpone once
    empty_until(c, c.state().find(k.o.addr)->recovery.ready_height); snap();   // recovery completes to n
    CHECK(put(c, {transfer(k.n, k.x.addr, 1000, 0)})); snap();
    return c;
}
static Chain plain_chain(const Key& a, const Key& b) {
    Chain c; CHECK(c.init_genesis(a.addr, 50000000, b.addr, 0));
    CHECK(put(c, {transfer(a, b.addr, 1000000, 0)})); CHECK(put(c, {})); CHECK(put(c, {transfer(b, a.addr, 3000, 0), transfer(a, b.addr, 20, 1)}));
    return c;
}
static Chain safety_chain(const Key& a, const Key& b) {
    Chain c; CHECK(c.init_genesis(a.addr, 50000000, b.addr, 0));
    CHECK(put(c, {safety(a, 0, 500000, 5, 0)})); CHECK(put(c, {transfer(a, b.addr, 600000, 1)})); empty_until(c, c.height() + 6);
    return c;
}

static std::string rstr(const std::string& s, const std::string& a, const std::string& b, std::size_t nth = 0) { // replace the nth occurrence
    std::size_t p = 0; for (std::size_t i = 0; i <= nth; ++i) { p = s.find(a, i ? p + 1 : 0); if (p == std::string::npos) { std::cerr << "test bug: pattern not found: " << a << "\n"; ++failures; return s; } }
    std::string r = s; r.replace(p, a.size(), b); return r;
}
static char other_hex(char c) { return c == '0' ? '1' : '0'; }
static std::string flip_after(const std::string& s, const std::string& marker, std::size_t nth = 0, std::size_t offset = 0) { // change one hex digit just after a marker
    std::size_t p = 0; for (std::size_t i = 0; i <= nth; ++i) { p = s.find(marker, i ? p + 1 : 0); if (p == std::string::npos) { std::cerr << "test bug: marker not found " << marker << "\n"; ++failures; return s; } }
    std::string r = s; r[p + marker.size() + offset] = other_hex(r[p + marker.size() + offset]); return r;
}
struct Split { std::string head; std::vector<std::string> blocks; std::string tail; };
static Split split_blocks(const std::string& t) {
    const std::string open = "\"blocks\": [", sep = ",\n    {\n      \"height\"", first = "\n    {\n      \"height\"", close = "\n  ]\n}\n";
    Split s; const std::size_t b0 = t.find(open) + open.size(); s.head = t.substr(0, b0);
    const std::size_t end = t.rfind(close); s.tail = t.substr(end);
    std::string body = t.substr(b0, end - b0);
    std::size_t p = 0; std::vector<std::size_t> starts; starts.push_back(body.find(first));
    while ((p = body.find(sep, p)) != std::string::npos) { starts.push_back(p + 1); p += 1; }
    for (std::size_t i = 0; i < starts.size(); ++i) {
        const std::size_t from = starts[i], to = i + 1 < starts.size() ? starts[i + 1] - 1 : body.size();
        s.blocks.push_back(body.substr(from, to - from));
    }
    return s;
}
static std::string join_blocks(const Split& s, const std::vector<std::size_t>& order) {
    std::string r = s.head; for (std::size_t i = 0; i < order.size(); ++i) r += (i ? "," : "") + s.blocks[order[i]]; return r + s.tail;
}

// loading must fail AND must leave the target chain untouched
static Chain sentinel() { Chain c; Key a = new_key(), b = new_key(); CHECK(c.init_genesis(a.addr, 777, b.addr, 0)); return c; }
static bool refuses(const std::string& text, std::string* why = nullptr) {
    Chain out = sentinel(); const std::string before = to_json(out); std::string err;
    const bool ok = load_chain_json_text(text, out, &err);
    if (why) *why = err;
    return !ok && !err.empty() && to_json(out) == before;
}
static bool loads_as(const std::string& text, const Chain& expect) { Chain out; std::string err; if (!load_chain_json_text(text, out, &err)) { std::cerr << "unexpected load error: " << err << "\n"; return false; } return same_chain(out, expect); }

static fs::path tmpdir() {
    static fs::path d = fs::temp_directory_path() / ("taz_persist_test_" + std::to_string(std::rand()) + "_" + std::to_string(static_cast<long>(std::time(nullptr))));
    fs::create_directories(d); return d;
}
static std::size_t leftovers(const fs::path& dir) { std::size_t n = 0; for (auto& e : fs::directory_iterator(dir)) if (e.path().filename().string().find(".tmp.") != std::string::npos) ++n; return n; }
static std::string slurp(const fs::path& p) { std::ifstream in(p, std::ios::binary); return std::string((std::istreambuf_iterator<char>(in)), std::istreambuf_iterator<char>()); }

static void t01_save() {
    Keys k; Chain c = full_chain(k); const fs::path p = tmpdir() / "t01.json"; std::string err;
    CHECK(save_chain_json(c, p.string(), &err)); CHECK(fs::exists(p));
    const std::string body = slurp(p);
    CHECK(body == to_json(c));                                   // the file is exactly the explorer export
    CHECK(body.find("tazvera-chain-export-v4") != std::string::npos);
    CHECK(leftovers(p.parent_path()) == 0);                      // no temporary file is left behind
    for (const Key* key : {&k.o, &k.g0, &k.g1, &k.g2, &k.v, &k.n, &k.x})
        CHECK(body.find(to_hex(key->sk)) == std::string::npos);  // no private key ever appears in the file
    CHECK(body.find("private") == std::string::npos && body.find("secret") == std::string::npos && body.find("seed") == std::string::npos);
    Chain empty; CHECK(!save_chain_json(empty, (tmpdir() / "empty.json").string(), &err) && !err.empty()); // nothing to save
    CHECK(!fs::exists(tmpdir() / "empty.json"));
}

static void t02_load() {
    Keys k; Chain c = full_chain(k); const fs::path p = tmpdir() / "t02.json"; std::string err;
    CHECK(save_chain_json(c, p.string(), &err));
    Chain loaded; CHECK(load_chain_json(p.string(), loaded, &err)); CHECK(same_chain(loaded, c));
    CHECK(loaded.state().balance(k.n.addr) == c.state().balance(k.n.addr) && loaded.state().balance(k.n.addr) > 0);   // the recovered funds
    CHECK(loaded.state().find(k.o.addr)->guardians.is_default());
    // a chain without any transactions, and one whose genesis lists nobody / one / two accounts
    Key a = new_key(), b = new_key();
    for (auto spec : {std::pair<Amount, Amount>{5, 7}, {5, 0}, {0, 7}, {0, 0}}) {
        Chain g; CHECK(g.init_genesis(a.addr, spec.first, b.addr, spec.second));
        CHECK(loads_as(to_json(g), g));
    }
    Chain z; CHECK(z.init_genesis(a.addr, 0, b.addr, 0)); CHECK(loads_as(to_json(z), z));
    Chain big; CHECK(big.init_genesis(a.addr, 18446744073709551000ULL, b.addr, 0)); CHECK(loads_as(to_json(big), big)); // exact above 2^53
    Chain bad = sentinel(); CHECK(!load_chain_json((tmpdir() / "nope.json").string(), bad, &err) && !err.empty());
}

static void t03_strict_json() {
    Key a = new_key(), b = new_key(); Chain c = plain_chain(a, b); const std::string good = to_json(c);
    CHECK(loads_as(good, c));
    const std::string compact = std::regex_replace(good, std::regex("\\s*\\n\\s*"), "");  // reformatted but equal JSON still loads
    CHECK(loads_as(compact, c));
    CHECK(loads_as(rstr(good, "{\n", "{ \t\r\n"), c));
    const std::vector<std::pair<const char*, std::string>> bad = {
        {"empty", ""}, {"only spaces", "   "}, {"empty object", "{}"}, {"array root", "[]"}, {"string root", "\"x\""},
        {"trailing garbage", good + "x"}, {"second document", good + good}, {"trailing comma object", rstr(good, "\"blocks\"", "\"blocks\"", 0).substr(0, good.rfind('}') ) .substr(0, good.rfind("\n  ]\n}") ) + "\n  ],\n}\n"},
        {"trailing comma array", rstr(good, "\n  ]\n}", ",\n  ]\n}")},
        {"comment", "// hi\n" + good}, {"block comment", rstr(good, "{\n", "{ /* x */\n")},
        {"BOM", std::string("\xEF\xBB\xBF") + good}, {"NUL byte", rstr(good, "\"format\"", std::string("\"for\0mat\"", 9))},
        {"single quotes", rstr(good, "\"format\"", "'format'")},
        {"number instead of string", rstr(good, "\"protocol_version\": \"2\"", "\"protocol_version\": 2")},
        {"true", rstr(good, "\"protocol_version\": \"2\"", "\"protocol_version\": true")},
        {"null", rstr(good, "\"protocol_version\": \"2\"", "\"protocol_version\": null")},
        {"duplicate key", rstr(good, "\"chain_id\"", "\"format\": \"x\", \"chain_id\"")},
        {"escape in string", rstr(good, "tazvera-local-prototype-v1", "tazvera-local\\u002dprototype-v1")},
        {"control char in string", rstr(good, "tazvera-local-prototype-v1", "tazvera-local\tprototype-v1")},
        {"non-ASCII in string", rstr(good, "tazvera-local-prototype-v1", "tazvera-loc\xC3\xA4l-prototype-v1")},
        {"unterminated string", good.substr(0, good.find("tazvera-local") + 5)},
        {"missing colon", rstr(good, "\"format\":", "\"format\"")}, {"missing comma", rstr(good, "\"format\": \"tazvera-chain-export-v1\",", "\"format\": \"tazvera-chain-export-v1\"")},
        {"object where string expected", rstr(good, "\"chain_id\": \"tazvera-local-prototype-v1\",\n  \"protocol", "\"chain_id\": {},\n  \"protocol")},
        {"array where string expected", rstr(good, "\"chain_id\": \"tazvera-local-prototype-v1\",\n  \"protocol", "\"chain_id\": [],\n  \"protocol")},
        {"string where array expected", rstr(good, "\"genesis_balances\": [", "\"genesis_balances\": \"x\", \"zzz\": [")},
        {"missing field", rstr(good, "  \"chain_id\": \"tazvera-local-prototype-v1\",\n", "")},
        {"unknown extra field", rstr(good, "\"blocks\": [", "\"extra\": \"1\",\n  \"blocks\": [")},
        {"unknown field in a transaction", rstr(good, "{\"txid\":", "{\"extra\": \"1\", \"txid\":")},
        {"unknown field in a block", rstr(good, "\"height\": \"1\"", "\"extra\": \"1\", \"height\": \"1\"")},
        {"uppercase hex", [&] { std::string s = good; const std::size_t p = s.find("\"from\": \"") + 9; for (std::size_t i = p; i < p + 40; ++i) if (s[i] >= 'a' && s[i] <= 'f') { s[i] = static_cast<char>(s[i] - 32); break; } return s; }()},
        {"hex too short", rstr(good, "\"from\": \"", "\"from\": \"0")}, {"non-hex digit", flip_after(rstr(good, "\"from\": \"", "\"from\": \"g", 0), "\"from\": \"", 0, 5)},
        {"leading zero number", rstr(good, "\"amount\": \"1000000\"", "\"amount\": \"01000000\"")},
        {"signed number", rstr(good, "\"amount\": \"1000000\"", "\"amount\": \"+1000000\"")},
        {"negative amount", rstr(good, "\"amount\": \"1000000\"", "\"amount\": \"-1000000\"")},
        {"fractional amount", rstr(good, "\"amount\": \"1000000\"", "\"amount\": \"1000000.0\"")},
        {"amount over 2^64", rstr(good, "\"amount\": \"1000000\"", "\"amount\": \"18446744073709551616\"")},
        {"empty number", rstr(good, "\"amount\": \"1000000\"", "\"amount\": \"\"")}, {"spaced number", rstr(good, "\"amount\": \"1000000\"", "\"amount\": \" 1000000\"")},
        {"huge number text", rstr(good, "\"amount\": \"1000000\"", "\"amount\": \"" + std::string(5000, '1') + "\"")},
        {"timestamp negative zero", rstr(good, "\"timestamp\": \"" + std::to_string(c.blocks()[1].timestamp) + "\"", "\"timestamp\": \"-0\"")},
    };
    // (a couple of the generated cases may not contain their anchor in this chain; fix the anchors by checking each is actually different)
    for (const auto& [name, text] : bad) { std::string why; if (!refuses(text, &why)) { std::cerr << "NOT REFUSED: " << name << "\n"; ++failures; } }
    // nesting bomb and size/node limits: refused quickly, no crash
    CHECK(refuses(std::string(200000, '[')) && refuses(std::string(200000, '{')));
    { Chain out = sentinel(); LoadOptions o; o.max_file_bytes = 100; std::string err; CHECK(!load_chain_json_text(good, out, &err, o) && err.find("larger") != std::string::npos); }
    { Chain out = sentinel(); LoadOptions o; o.max_nodes = 50; std::string err; CHECK(!load_chain_json_text(good, out, &err, o) && err.find("too many") != std::string::npos); }
    { std::string many = "{\"a\": ["; for (int i = 0; i < 3000; ++i) many += "\"\","; many += "\"\"]}"; LoadOptions o; o.max_nodes = 1000; Chain out = sentinel(); std::string err; CHECK(!load_chain_json_text(many, out, &err, o)); }
}

static void t04_replay() {
    Keys k; std::vector<Chain> mid; Chain c = full_chain(k, &mid); const std::string text = to_json(c);
    CHECK(c.blocks().size() > 300);
    Chain out; std::string err; CHECK(load_chain_json_text(text, out, &err)); CHECK(same_chain(out, c));
    // replay really checks the rules: a self-consistent file in which a block is missing, repeated, swapped or foreign is refused
    const Split s = split_blocks(text); const std::size_t n = s.blocks.size(); CHECK(n == c.blocks().size());
    std::vector<std::size_t> all(n); for (std::size_t i = 0; i < n; ++i) all[i] = i;
    CHECK(loads_as(join_blocks(s, all), c));
    auto without = [&](std::size_t drop) { std::vector<std::size_t> o; for (std::size_t i : all) if (i != drop) o.push_back(i); return o; };
    std::string why;
    CHECK(refuses(join_blocks(s, without(5)), &why) && why.find("block 5") != std::string::npos);      // a block is missing
    { Chain shorter; std::string e2; CHECK(!refuses(join_blocks(s, without(n - 1)), &e2)); }               // dropping the LAST block gives a shorter but valid chain (limitation: README)
    { auto o = all; std::swap(o[7], o[8]); CHECK(refuses(join_blocks(s, o)));}                          // two blocks swapped
    { auto o = all; o.insert(o.begin() + 9, 8); CHECK(refuses(join_blocks(s, o)));}                     // a block repeated
    { auto o = all; o.push_back(n - 1); CHECK(refuses(join_blocks(s, o)));}                             // the last block twice
    // a block from a different chain with a different genesis
    Keys k2; Chain other = full_chain(k2); const Split so = split_blocks(to_json(other));
    { Split m = s; m.blocks[6] = so.blocks[6]; CHECK(refuses(join_blocks(m, all), &why));}
    // the genesis block must match the genesis balances
    CHECK(refuses(rstr(text, "\"balance\": \"100000000\"", "\"balance\": \"100000001\""), &why) && why.find("genesis") != std::string::npos);
    CHECK(refuses(rstr(text, "\"address\": \"" + to_hex(k.g0.addr) + "\"", "\"address\": \"" + to_hex(k.g1.addr) + "\"")));
    // dropping the last blocks gives a shorter chain that is still valid and equals the earlier snapshot
    { Chain shorter; std::vector<std::size_t> o(all.begin(), all.begin() + static_cast<long>(mid.back().blocks().size())); CHECK(loads_as(join_blocks(s, o), mid.back())); }
}

static void t05_integrity() {
    Keys k; Chain c = full_chain(k); const std::string text = to_json(c); std::string why;
    CHECK(refuses(flip_after(text, "\"hash\": \"", 20), &why) && why.find("block hash") != std::string::npos);     // block hash
    CHECK(refuses(flip_after(text, "\"hash\": \"", 0)));                                                             // genesis hash
    CHECK(refuses(flip_after(text, "\"signature\": \"", 0), &why));                                                  // transaction signature (txid covers it)
    CHECK(refuses(flip_after(text, "\"signature\": \"", 3, 100), &why));
    CHECK(refuses(flip_after(text, "\"pubkey\": \"", 1), &why));                                                    // public key
    CHECK(refuses(flip_after(text, "\"txid\": \"", 2), &why) && why.find("txid") != std::string::npos);            // txid
    CHECK(refuses(rstr(text, "\"amount\": \"2000000\"", "\"amount\": \"2000001\""), &why));                         // amount
    CHECK(refuses(rstr(text, "\"fee\": \"1000\"", "\"fee\": \"1\""), &why));                                        // fee
    CHECK(refuses(rstr(text, "\"nonce\": \"1\"", "\"nonce\": \"9\""), &why));                                       // nonce
    CHECK(refuses(flip_after(text, "\"state_root\": \"", 30), &why));                                               // a state root in the middle
    CHECK(refuses(flip_after(text, "\"state_root\": \"", 0), &why));                                                // genesis state root
    CHECK(refuses(flip_after(text, "\"previous_hash\": \"", 12), &why));                                            // link to the previous block
    CHECK(refuses(rstr(text, "\"height\": \"3\"", "\"height\": \"4\""), &why));                                     // height
    { const std::string t1 = std::to_string(c.blocks()[1].timestamp); CHECK(refuses(rstr(text, "\"timestamp\": \"" + t1 + "\"", "\"timestamp\": \"" + t1 + "1\""), &why)); }                           // timestamp
    // chain ID: in the header, in a block, in a transaction
    CHECK(refuses(rstr(text, "\"chain_id\": \"tazvera-local-prototype-v1\"", "\"chain_id\": \"tazvera-local-prototype-v2\"", 0), &why) && why.find("chain") != std::string::npos);
    CHECK(refuses(rstr(text, "\"chain_id\": \"tazvera-local-prototype-v1\"", "\"chain_id\": \"tazvera-local-prototype-v2\"", 3), &why));
    CHECK(refuses(rstr(text, "\"chain_id\": \"tazvera-local-prototype-v1\"", "\"chain_id\": \"tazvera-local-prototype-v2\"", 5), &why));
    // protocol version: header, block, transaction — change 2 → 1 (older) or 2 → 3 (unsupported)
    CHECK(refuses(rstr(text, "\"protocol_version\": \"2\"", "\"protocol_version\": \"1\"", 0), &why));
    CHECK(refuses(rstr(text, "\"protocol_version\": \"2\"", "\"protocol_version\": \"1\"", 2), &why));
    CHECK(refuses(rstr(text, "\"protocol_version\": \"2\"", "\"protocol_version\": \"3\"", 4), &why));
    // kinds and guardian data
    CHECK(refuses(rstr(text, "\"kind\": \"3\"", "\"kind\": \"6\""), &why));
    CHECK(refuses(rstr(text, "\"kind\": \"3\"", "\"kind\": \"1\""), &why));
    CHECK(refuses(rstr(text, "\"guardian_threshold\": \"2\"", "\"guardian_threshold\": \"1\""), &why));
    CHECK(refuses(rstr(text, "\"veto\": \"" + to_hex(k.v.addr) + "\"", "\"veto\": \"" + to_hex(k.x.addr) + "\""), &why));
    CHECK(refuses(rstr(text, "\"new_owner\": \"" + to_hex(k.n.addr) + "\"", "\"new_owner\": \"" + to_hex(k.x.addr) + "\"", 0), &why));
    // v8.2 closed this: the genesis commitment in block 0's previous_hash covers BOTH genesis accounts,
    // a zero balance included, so changing either address is refused. (Until v8.1 this was a pinned KNOWN
    // LIMIT: the zero-balance account never reached the state root, so no block hash covered it and such a
    // file still loaded.)
    { Key z = new_key(); Chain zc; CHECK(zc.init_genesis(k.o.addr, 100000000, z.addr, 0)); CHECK(put(zc, {transfer(k.o, k.g0.addr, 1, 0)}));
      const std::string zt = to_json(zc); Key other = new_key();
      Chain out; std::string e;
      // v8.2: genesis_commitment covers zero-balance addresses too
      CHECK(refuses(rstr(zt, to_hex(z.addr), to_hex(other.addr)), &why));
      // but a NON-zero genesis balance or address is fully protected
      CHECK(refuses(rstr(zt, to_hex(k.o.addr), to_hex(other.addr), 0), &why)); }
    // the original is untouched by all of this
    CHECK(loads_as(text, c));
}

static void t06_incomplete() {
    Key a = new_key(), b = new_key(); Chain small = plain_chain(a, b); const std::string text = to_json(small);
    std::size_t refused = 0;
    for (std::size_t len = 0; len + 1 < text.size(); ++len) {      // cut short at EVERY possible length (the last newline is optional)
        Chain out = sentinel(); const std::string before = to_json(out); std::string err;
        if (load_chain_json_text(std::string_view(text.data(), len), out, &err)) { std::cerr << "accepted a prefix of length " << len << "\n"; ++failures; break; }
        if (to_json(out) != before || err.empty()) { ++failures; break; }
        ++refused;
    }
    CHECK(refused == text.size() - 1);
    CHECK(loads_as(text, small));                                    // the whole file is fine; the final newline is optional
    CHECK(loads_as(text.substr(0, text.size() - 1), small));
    Keys k; const std::string big = to_json(full_chain(k));
    for (std::size_t len = 0; len + 1 < big.size() - 1; len += 997) CHECK(refuses(big.substr(0, len)));
    const fs::path d = tmpdir(); std::string err; Chain out = sentinel(); const std::string before = to_json(out);
    CHECK(!load_chain_json((d / "missing.json").string(), out, &err));
    CHECK(!load_chain_json(d.string(), out, &err));                  // a directory
    { std::ofstream(d / "empty.json", std::ios::binary); CHECK(!load_chain_json((d / "empty.json").string(), out, &err)); }
    { std::ofstream f(d / "bin.json", std::ios::binary); for (int i = 0; i < 5000; ++i) f.put(static_cast<char>(std::rand())); }
    CHECK(!load_chain_json((d / "bin.json").string(), out, &err));
    { std::ofstream f(d / "half.json", std::ios::binary); f.write(text.data(), static_cast<std::streamsize>(text.size() / 2)); }
    CHECK(!load_chain_json((d / "half.json").string(), out, &err) && !err.empty());
    { LoadOptions o; o.max_file_bytes = 10; { std::ofstream f(d / "ok.json", std::ios::binary); f << text; } CHECK(!load_chain_json((d / "ok.json").string(), out, &err, o)); }
    CHECK(to_json(out) == before);                                   // nothing above touched the chain
}

static void t07_atomic_save() {
    const fs::path d = tmpdir() / "t07"; fs::create_directories(d); const std::string p = (d / "chain.json").string(); std::string err;
    Key a = new_key(), b = new_key(); Chain c1 = plain_chain(a, b), c2 = safety_chain(a, b); Keys k; Chain c3 = full_chain(k);
    CHECK(save_chain_json(c1, p, &err)); CHECK(save_chain_json(c2, p, &err));          // replacing an existing file works
    { Chain l; CHECK(load_chain_json(p, l, &err) && same_chain(l, c2)); }
    CHECK(leftovers(d) == 0);
    // crash after the temporary file is written but before the rename: the old file is intact
    testing::persist_stop_before_rename = true;
    CHECK(!save_chain_json(c3, p, &err));
    testing::persist_stop_before_rename = false;
    { Chain l; CHECK(load_chain_json(p, l, &err) && same_chain(l, c2)); }
    CHECK(leftovers(d) == 1);                                                          // the stale temporary file is still there ...
    CHECK(save_chain_json(c3, p, &err));                                               // ... and does not get in the way
    { Chain l; CHECK(load_chain_json(p, l, &err) && same_chain(l, c3)); }
    for (auto& e : fs::directory_iterator(d)) if (e.path().filename().string().find(".tmp.") != std::string::npos) { Chain l = sentinel(); CHECK(load_chain_json(e.path().string(), l, &err)); CHECK(same_chain(l, c3)); } // the stale tmp file is a complete, valid copy of the file that was being saved
    // a damaged target (as an unsafe writer could leave) is refused, then a normal save repairs it
    { std::ofstream f(p, std::ios::binary | std::ios::trunc); const std::string t = to_json(c3); f.write(t.data(), static_cast<std::streamsize>(t.size() / 3)); }
    { Chain l = sentinel(); CHECK(!load_chain_json(p, l, &err)); }
    CHECK(save_chain_json(c3, p, &err)); { Chain l; CHECK(load_chain_json(p, l, &err) && same_chain(l, c3)); }
    // impossible destinations fail cleanly without exceptions and without leaving files
    CHECK(!save_chain_json(c1, (d / "no_such_dir" / "x.json").string(), &err) && !err.empty());
    fs::create_directories(d / "isdir.json");
    const std::size_t before = leftovers(d);
    CHECK(!save_chain_json(c1, (d / "isdir.json").string(), &err) && !err.empty());   // the target is a directory
    CHECK(leftovers(d) == before && fs::is_directory(d / "isdir.json"));
    // several writers at the same time: the file is always one complete chain
    const std::string q = (d / "shared.json").string();
    std::vector<std::thread> th; std::atomic<int> ok{0};
    const Chain* chains[3] = {&c1, &c2, &c3};
    for (int t = 0; t < 4; ++t) th.emplace_back([&, t] { for (int i = 0; i < 15; ++i) { std::string e; if (save_chain_json(*chains[(t + i) % 3], q, &e)) ++ok; } });
    for (auto& t : th) t.join();
    CHECK(ok == 60);
    { Chain l; CHECK(load_chain_json(q, l, &err)); CHECK(same_chain(l, c1) || same_chain(l, c2) || same_chain(l, c3)); }
    std::size_t stale = 0; for (auto& e : fs::directory_iterator(d)) if (e.path().filename().string().rfind("shared.json.tmp.", 0) == 0) ++stale;
    CHECK(stale == 0);
}

static void t08_restart() {
    Keys k; std::vector<Chain> mid; Chain whole = full_chain(k, &mid); const fs::path d = tmpdir() / "t08"; fs::create_directories(d); std::string err;
    CHECK(mid.size() >= 8);
    // Stop at every saved moment (a transfer being held, a recovery waiting, ...), "restart" by loading,
    // then give both the loaded chain and the one that never stopped the same next block.
    for (std::size_t i = 0; i < mid.size(); ++i) {
        const std::string p = (d / ("snap" + std::to_string(i) + ".json")).string();
        CHECK(save_chain_json(mid[i], p, &err));
        Chain reloaded; CHECK(load_chain_json(p, reloaded, &err)); CHECK(same_chain(reloaded, mid[i]));
        CHECK(reloaded.state().held_total() == mid[i].state().held_total());
        // the very same block must be accepted by both and lead to the same state
        std::vector<Transaction> next; // a harmless transfer from x (always has balance and a known nonce)
        next.push_back(transfer(k.x, k.g0.addr, 1, mid[i].state().nonce(k.x.addr)));
        Chain a = mid[i], b = reloaded; const std::int64_t ts = g_ts++;
        const ChainResult ra = a.append_block(next, ts), rb = b.append_block(next, ts);
        CHECK(ra.ok == rb.ok); if (ra.ok) CHECK(same_chain(a, b));
        // a follower that only gets blocks accepts the reloaded chain's new block
        if (rb.ok) { Chain f = mid[i]; CHECK(f.accept_block(b.blocks().back()).ok); CHECK(f.state().state_root() == b.state().state_root()); }
    }
    // restart the whole life of the chain: save, load, save again, load again: byte-for-byte stable
    const std::string p1 = (d / "r1.json").string(), p2 = (d / "r2.json").string();
    CHECK(save_chain_json(whole, p1, &err)); Chain r1; CHECK(load_chain_json(p1, r1, &err));
    CHECK(save_chain_json(r1, p2, &err)); Chain r2; CHECK(load_chain_json(p2, r2, &err));
    CHECK(slurp(p1) == slurp(p2) && same_chain(r2, whole));
    // the loaded chain keeps working: finish the recovery story on it and on the original
    Chain a = whole, b = r2; const std::int64_t ts = g_ts++;
    CHECK(a.append_block({transfer(k.n, k.g1.addr, 5, nx(a, k.n))}, ts).ok && b.append_block({transfer(k.n, k.g1.addr, 5, nx(b, k.n))}, ts).ok);
    CHECK(same_chain(a, b));
}

static void t09_versions() {
    Key a = new_key(), b = new_key(); Keys k;
    Chain plain = plain_chain(a, b), safe = safety_chain(a, b), guard = full_chain(k);
    const std::string tp = to_json(plain), ts = to_json(safe), tg = to_json(guard);
    CHECK(tp.find("export-v1") != std::string::npos && ts.find("export-v2") != std::string::npos && tg.find("export-v4") != std::string::npos);
    std::string why;
    // formats that do not exist or are for something else
    for (const char* f : {"tazvera-chain-export-v0", "tazvera-chain-export-v5", "tazvera-chain-export-v", "tazvera-chain-export-", "tazvera-chain-export-v10", "tazvera-chain-export-v1 ", "tazvera-chain-export-V1", "other-v1", ""})
        CHECK(refuses(rstr(tp, "tazvera-chain-export-v1", f), &why));
    // a label that says less (or more) than the file contains is refused, so history cannot be passed off as simpler
    CHECK(refuses(rstr(ts, "export-v2", "export-v1"), &why) && why.find("label") != std::string::npos);
    CHECK(refuses(rstr(tg, "export-v4", "export-v1"))); CHECK(refuses(rstr(tg, "export-v4", "export-v2")));
    CHECK(refuses(rstr(tp, "export-v1", "export-v2"))); CHECK(refuses(rstr(tp, "export-v1", "export-v4"))); CHECK(refuses(rstr(ts, "export-v2", "export-v4")));
    // Core v7 wrote guardian chains with the label v3 (veto key already present): same thing as v4, still accepted
    CHECK(loads_as(rstr(tg, "export-v4", "export-v3"), guard));
    // Core v6 layouts: no "veto" field in transactions
    const std::regex veto_field("\"veto\": \"[0-9a-f]{40}\", ");
    const std::string tg6 = std::regex_replace(tg, veto_field, ""), tp6 = std::regex_replace(tp, veto_field, ""), ts6 = std::regex_replace(ts, veto_field, "");
    CHECK(tg6.size() < tg.size());
    CHECK(refuses(rstr(tg6, "export-v4", "export-v3"), &why) && why.find("Core v6") != std::string::npos);   // v6 guardian file: refused, and says why
    CHECK(refuses(tg6, &why) && why.find("veto") != std::string::npos);                                        // same layout under today's label
    CHECK(loads_as(tp6, plain) && loads_as(ts6, safe));                                                       // v6 plain/safety files: rules unchanged, still load
    CHECK(refuses(rstr(tp6, "export-v1", "export-v4"))); CHECK(refuses(rstr(tp6, "export-v1", "export-v3"), &why));
    { std::string mixed = rstr(tg, "\"veto\": \"" + to_hex(k.v.addr) + "\", ", ""); CHECK(refuses(mixed, &why)); }   // two layouts in one file
    // a plain file cannot smuggle a veto field
    { std::string t = rstr(tp6, "\"new_owner\": ", "\"veto\": \"" + std::string(40, '0') + "\", \"new_owner\": "); CHECK(refuses(t, &why)); }
    // changed parameters and versions
    for (const char* p : {"\"fee_transfer_v1\": \"1000\"", "\"max_block_txs\": \"10000\"", "\"limit_window_blocks\": \"1000\"", "\"max_hold_blocks\": \"100000\"", "\"safety_delay_blocks\": \"500\"", "\"max_guardians\": \"5\"", "\"recovery_delay_blocks\": \"300\""}) {
        std::string repl = p; repl.insert(repl.size() - 2, "1");
        CHECK(refuses(rstr(tg, p, repl), &why) && why.find("differs") != std::string::npos);
    }
    CHECK(refuses(rstr(tp, "\"protocol_version\": \"2\"", "\"protocol_version\": \"1\"", 0)));
    // old layouts (no guardian fields at all) are refused with a clear reason
    CHECK(refuses(std::regex_replace(tp6, std::regex("\"new_owner\": \"[0-9a-f]{40}\", \"guardian_threshold\": \"[0-9]+\", \"guardians\": \\[\\], "), ""), &why));
}

static void t10_random_damage() {
    Keys k; Chain c = plain_chain(k.o, k.g0); Chain s = safety_chain(k.x, k.n);
    // medium sized guardian chain without the 300 idle blocks keeps this quick
    Chain g; CHECK(g.init_genesis(k.o.addr, 100000000, k.g0.addr, 5000000));
    CHECK(put(g, {transfer(k.o, k.g1.addr, 2000000, 0), transfer(k.o, k.v.addr, 1000000, 1)}));
    CHECK(put(g, {setg(k.o, {k.g0.addr, k.g1.addr}, 2, k.v.addr, 2)})); CHECK(put(g, {vote(k.g0, k.o.addr, k.n.addr, 0), vote(k.g1, k.o.addr, k.n.addr, 0)}));
    std::uint64_t seed = 12345; auto rnd = [&seed](std::uint64_t n) { seed = seed * 6364136223846793005ULL + 1442695040888963407ULL; return (seed >> 33) % n; };
    const char alphabet[] = "0123456789abcdefABCDEF\"{}[]:, \n-\\xyz";
    std::size_t accepted = 0, total = 0;
    for (const Chain* chain : {&c, &s, &g}) {
        const std::string text = to_json(*chain);
        for (int i = 0; i < 2500; ++i) {
            std::string m = text; const std::size_t pos = static_cast<std::size_t>(rnd(m.size()));
            const int kind = static_cast<int>(rnd(4));
            if (kind == 0) m[pos] = alphabet[rnd(sizeof(alphabet) - 1)];
            else if (kind == 1) m.erase(pos, 1 + rnd(3));
            else if (kind == 2) m.insert(pos, 1, alphabet[rnd(sizeof(alphabet) - 1)]);
            else { const std::size_t q = static_cast<std::size_t>(rnd(m.size())); std::swap(m[pos], m[q]); }
            if (m == text) continue;
            ++total; Chain out; std::string err;
            if (load_chain_json_text(m, out, &err)) {      // accepted: then it MUST be exactly the same chain (e.g. only whitespace changed)
                ++accepted; if (!same_chain(out, *chain)) { std::cerr << "ACCEPTED A DIFFERENT CHAIN: " << (m.size()==text.size()? "same-length edit at ":"edit at ") << pos << " kind " << kind << "\n   original: " << text.substr(pos>30?pos-30:0, 70) << "\n   mutated:  " << m.substr(pos>30?pos-30:0, 70) << "\n"; ++failures; }
            }
        }
    }
    std::cout << "random damage: " << total << " damaged files, " << accepted << " loaded with an identical ledger (whitespace-only edits), the rest refused\n";
    CHECK(total > 6000);
}

// The demo chains shipped in the repository must load with the real loader and re-export byte for byte.
static void t11_repository_demo_files() {
#ifdef TAZ_SOURCE_DIR
    std::size_t n = 0;
    for (auto& e : fs::directory_iterator(fs::path(TAZ_SOURCE_DIR) / "explorer")) {
        if (e.path().extension() != ".json") continue;
        ++n; Chain out; std::string err;
        const bool ok = load_chain_json(e.path().string(), out, &err);
        if (!ok) std::cerr << "repository file " << e.path().filename() << " does not load: " << err << "\n";
        CHECK(ok);
        if (ok) { CHECK(out.height() > 0); CHECK(slurp(e.path()) == to_json(out)); }
    }
    CHECK(n >= 3);   // plain, safety and recovery demos
#else
    // v8.3: without TAZ_SOURCE_DIR this function used to compile to nothing, so a hand-written build
    // reported success for a check that never ran. Fail loudly instead.
    CHECK(false && "TAZ_SOURCE_DIR must be defined for taz_persist_tests (see CMakeLists.txt)");
#endif
}

// v8.8: UTF-8 paths, independent of the platform's native encoding. The library takes a std::string holding
// UTF-8 bytes; std::filesystem::path needs the same bytes wrapped in a u8string.
static std::string utf8_of(const fs::path& p) { const std::u8string u = p.u8string(); return std::string(u.begin(), u.end()); }
static fs::path utf8_path(const std::string& s) { return fs::path(std::u8string(s.begin(), s.end())); }

// v8.8: a chain file under a directory whose name is not ASCII. On Windows this used to fail at status(),
// file_size() and ifstream, because all three took a narrow std::string (ANSI code page) even though saving
// the same path already worked.
static void t13_non_ascii_path() {
    const std::string name = "taz-\xE0\xA4\x9F\xE0\xA5\x87\xE0\xA4\xB8\xE0\xA5\x8D\xE0\xA4\x9F-\xC3\xBC"; // taz-टेस्ट-ü
    const std::string dir_utf8 = utf8_of(tmpdir()) + "/" + name;
    const fs::path dir = utf8_path(dir_utf8);
    std::error_code ec; fs::create_directories(dir, ec); CHECK(!ec);
    if (ec) return;                                            // cannot create it here: nothing to test
    Keys k; Chain c = full_chain(k); std::string err;
    const std::string file = dir_utf8 + "/chain.json";
    CHECK(save_chain_json(c, file, &err));
    { Chain out; CHECK(load_chain_json(file, out, &err)); CHECK(same_chain(out, c)); }
    { Chain out = sentinel(); CHECK(!load_chain_json(dir_utf8 + "/missing.json", out, &err) && !err.empty()); }
    // v8.9: the cleanup path under a non-ASCII name. The sweep builds its prefix from the target's file
    // name, so this is exactly where a Windows path conversion could go wrong.
    const std::string stale = file + ".tmp.999999.1";
    { std::ofstream out(utf8_path(stale), std::ios::binary); out << "half written"; }
    fs::last_write_time(utf8_path(stale), fs::file_time_type::clock::now() - std::chrono::hours(2));
    CHECK(save_chain_json(c, file, &err));
    CHECK(!fs::exists(utf8_path(stale)));                       // old enough: swept
    // a young temporary file belongs to another process that may still be writing it
    const std::string young = file + ".tmp.999999.2";
    { std::ofstream out(utf8_path(young), std::ios::binary); out << "in progress"; }
    CHECK(save_chain_json(c, file, &err));
    CHECK(fs::exists(utf8_path(young)));                        // too young: left alone
    fs::remove(utf8_path(young));
    { Chain out; CHECK(load_chain_json(file, out, &err)); CHECK(same_chain(out, c)); }
    fs::remove_all(dir, ec);
}

// v8.8: the flag the future node will set. A load with no pin is refused when it is on, and nothing changes
// when it is off, which is what keeps the library compatible.
static void t14_require_genesis_pin() {
    Keys k; Chain c = plain_chain(k.o, k.g0); const std::string text = to_json(c); std::string why;
    LoadOptions strict; strict.require_genesis_pin = true;
    { Chain out = sentinel(); CHECK(!load_chain_json_text(text, out, &why, strict)); }
    { LoadOptions o = strict; o.expected_genesis_commitment = c.genesis_commitment(); Chain out; CHECK(load_chain_json_text(text, out, &why, o)); }
    { LoadOptions o; Chain out; CHECK(load_chain_json_text(text, out, &why, o)); }
}

// v8.9: the version is written in exactly one place (include/taz/types.hpp) and the README must agree.
// Before this, CMake said 0.8.2 while the README said v8.8, and nothing failed.
static void t15_version_consistency() {
#ifdef TAZ_SOURCE_DIR
    const fs::path root = fs::path(TAZ_SOURCE_DIR);
    const std::string readme = slurp(root / "README.md");
    const std::string first_line = readme.substr(0, readme.find('\n'));
    CHECK(first_line.find(std::string(CORE_VERSION)) != std::string::npos);
    const std::string types = slurp(root / "include" / "taz" / "types.hpp");
    CHECK(types.find("CORE_VERSION") != std::string::npos);
    const std::string cmake = slurp(root / "CMakeLists.txt");
    CHECK(cmake.find("TAZ_CORE_VERSION") != std::string::npos);       // CMake reads the constant
    CHECK(cmake.find("VERSION 0.") == std::string::npos);             // no hard-coded old version left
#else
    CHECK(false && "TAZ_SOURCE_DIR must be defined for taz_persist_tests (see CMakeLists.txt)");
#endif
}

// v8.9: save_chain_json is documented as "returns false and sets *error on any problem". The stale-file
// sweep used to run outside the try block, so a filesystem_error from it could escape the function.
static void t16_save_never_throws() {
    Keys k; Chain c = plain_chain(k.o, k.g0); std::string err;
    const fs::path d = tmpdir() / "t16"; std::error_code ec; fs::create_directories(d, ec);
    fs::create_directories(d / "dir.json", ec);
    bool threw = false;
    try {
        CHECK(!save_chain_json(c, (d / "dir.json").string(), &err));          // target is a directory
        CHECK(!save_chain_json(c, (d / "no_such_dir" / "x.json").string(), &err));
        CHECK(save_chain_json(c, (d / "ok.json").string(), &err));            // and a good one still works
    } catch (...) { threw = true; }
    CHECK(!threw);
}

// v8.11: when a save fails, the temporary file must still be removed — and under a non-ASCII directory the
// old cleanup could not do it, because std::remove() takes a narrow path (ANSI on Windows). The target here is
// a directory, so the replace always fails and the error path runs.
static void t17_cleanup_on_failure_utf8() {
    const std::string name = "taz-\xE0\xA4\x9F\xE0\xA5\x87\xE0\xA4\xB8\xE0\xA5\x8D\xE0\xA4\x9F-fail"; // taz-टेस्ट-fail
    const std::string dir_utf8 = utf8_of(tmpdir()) + "/" + name;
    const fs::path dir = utf8_path(dir_utf8);
    std::error_code ec; fs::create_directories(dir, ec); CHECK(!ec);
    if (ec) return;
    fs::create_directories(utf8_path(dir_utf8 + "/target.json"), ec);   // a directory where the file should go
    CHECK(!ec);
    Keys k; Chain c = plain_chain(k.o, k.g0); std::string err;
    CHECK(!save_chain_json(c, dir_utf8 + "/target.json", &err));
    CHECK(!err.empty());
    std::size_t tmp = 0;
    for (auto& e : fs::directory_iterator(dir)) if (e.path().filename().string().find(".tmp.") != std::string::npos) ++tmp;
    CHECK(tmp == 0);                                                   // no half-written file left behind
    fs::remove_all(dir, ec);
}

int main() {
    std::srand(4242);
    t01_save(); t02_load(); t03_strict_json(); t04_replay(); t05_integrity(); t06_incomplete(); t07_atomic_save(); t08_restart(); t09_versions(); t10_random_damage(); t11_repository_demo_files(); t13_non_ascii_path(); t14_require_genesis_pin(); t15_version_consistency(); t16_save_never_throws(); t17_cleanup_on_failure_utf8();
    std::error_code ec; fs::remove_all(tmpdir(), ec);
    if (failures) { std::cerr << failures << " test(s) failed\n"; return EXIT_FAILURE; }
    std::cout << "Persistence tests passed (11 sections). This is not a security audit.\n"; return EXIT_SUCCESS;
}
