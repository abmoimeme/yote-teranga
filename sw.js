// Offline cache. Raise the version number whenever the site files change.
var VERSION="yote-teranga-v2";
var FILES=["./", "index.html", "config.js", "manifest.webmanifest", "fonts/baloo2-600.woff2", "fonts/baloo2-800.woff2", "fonts/figtree-400.woff2", "fonts/figtree-600.woff2", "fonts/figtree-700.woff2", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION&&k.indexOf("yote-teranga-")===0}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  if(new URL(e.request.url).origin!==location.origin)return;
  if(e.request.url.indexOf("version.txt")>=0)return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r&&r.ok){var copy=r.clone();caches.open(VERSION).then(function(c){c.put(e.request,copy)})}
    return r;
  }).catch(function(){return caches.match(e.request,{ignoreSearch:true}).then(function(m){return m||caches.match("index.html")})}));
});
