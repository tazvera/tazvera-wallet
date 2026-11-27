/* Shared Shardeum RPC endpoints. Browser global + CommonJS export for Vercel functions. */
(function(root){
  "use strict";
  var config=Object.freeze({
    testnetRpc:"https://api-mezame.shardeum.org",
    mainnetRpc:"https://api.shardeum.org"
  });
  if(typeof module!=="undefined"&&module.exports)module.exports=config;
  if(root)root.TAZVERA_SHARDEUM=config;
})(typeof globalThis!=="undefined"?globalThis:this);
