/* Device key (foundation only, not used by the wallet yet).
   A non-extractable AES-GCM key kept in IndexedDB. Its bytes can never be read by page code,
   so a copied localStorage blob cannot be decrypted offline without this device's key.
   Nothing here changes how the wallet unlocks; that comes in a later, tested step. */
var DeviceKey=(function(){
  var DB="tz-device",STORE="keys",ID="wallet-kek";
  function b64(u8){var s="";for(var i=0;i<u8.length;i++)s+=String.fromCharCode(u8[i]);return btoa(s)}
  function un64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
  function subtle(){return (typeof crypto!=="undefined"&&crypto.subtle)?crypto.subtle:null}
  function open(){return new Promise(function(res,rej){var r=indexedDB.open(DB,1);r.onupgradeneeded=function(){r.result.createObjectStore(STORE)};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
  function kvGet(){return open().then(function(db){return new Promise(function(res,rej){var q=db.transaction(STORE,"readonly").objectStore(STORE).get(ID);q.onsuccess=function(){db.close();res(q.result||null)};q.onerror=function(){db.close();rej(q.error)}})})}
  function kvPut(k){return open().then(function(db){return new Promise(function(res,rej){var t=db.transaction(STORE,"readwrite");t.objectStore(STORE).put(k,ID);t.oncomplete=function(){db.close();res(true)};t.onerror=function(){db.close();rej(t.error)}})})}
  /* Load the device key, or create it once. Never exportable. */
  function load(){return kvGet().then(function(k){return k?k:subtle().generateKey({name:"AES-GCM",length:256},false,["encrypt","decrypt"]).then(function(nk){return kvPut(nk).then(function(){return nk})})})}
  /* Encrypt a string with the device key. Returns a JSON-safe object. */
  function seal(key,text){var s=subtle(),iv=crypto.getRandomValues(new Uint8Array(12));return s.encrypt({name:"AES-GCM",iv:iv},key,new TextEncoder().encode(text)).then(function(ct){return {v:1,iv:b64(iv),ct:b64(new Uint8Array(ct))}})}
  /* Decrypt; throws if the key is wrong or the data was changed. */
  function unseal(key,box){if(!box||box.v!==1)return Promise.reject(new Error("bad box"));return subtle().decrypt({name:"AES-GCM",iv:un64(box.iv)},key,un64(box.ct)).then(function(pt){return new TextDecoder().decode(pt)})}
  return {load:load,seal:seal,unseal:unseal,_b64:b64,_un64:un64};
})();
