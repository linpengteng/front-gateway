!function(){"use strict";importScripts("/net-gateway-config.js");const e=e=>"[object WindowClient]"===Object.prototype.toString.call(e),t=e=>"[object Object]"===Object.prototype.toString.call(e),r=e=>"[object Array]"===Object.prototype.toString.call(e),s=(e={})=>{o.has(e?.id)&&o.get(e.id).port?.postMessage({id:e.id,uid:e.uid,type:e.type,certs:e?.certs||null,clients:e?.clients||null,result:e?.result||null,error:e?.error||null})},i=(e,s={})=>{switch(e){case"clear":n.clear();break;case"reset":if(n.clear(),t(s))for(const e in s)n.set(e,s[e]);break;case"update":if(t(s))for(const e in s)n.set(e,s[e]);break;case"remove":if(r(s))for(const e of s)n.delete(e);if(t(s))for(const e in s)n.delete(e)}},c=(e,i={})=>{switch(e){case"clear":o.clear();break;case"reset":if(o.clear(),t(i))for(const e in i)o.set(e,{...o.get(e),...i[e],port:o.get(e)?.port});break;case"update":if(t(i))for(const e in i)o.set(e,{...o.get(e),...i[e],port:o.get(e)?.port});break;case"remove":if(r(i))for(const e of i)o.delete(e);if(t(i))for(const e in i)o.delete(e);break;case"checkup":self.clients.matchAll().then((e=>{const s=t(i)?Object.keys(i):r(i)?i:[];for(const t of o.keys()){const r=s.some((e=>t===e)),i=e.some((e=>t===e.id));r||i||o.delete(t)}}));break;case"synchrony":{const e=t(i)?Object.keys(i):r(i)?i:[];for(const t of e)c=t,"[object String]"===Object.prototype.toString.call(c)&&s({id:t,uid:"[NET_SYNC_ID]",type:"[CALL:NET_SYNC]",certs:Object.fromEntries(n.entries()),clients:{[t]:{...o.get(t),port:null}}});break}}var c};self.addEventListener("install",(e=>{e.waitUntil(self.skipWaiting())})),self.addEventListener("activate",(e=>{e.waitUntil(self.clients.claim())})),self.addEventListener("message",(r=>{if(!e(r.source))return;if(!t(r.data))return;const a=r.source.id;r.data.uid;const l=r.data.type,d=r.ports[0],u=r.data.certs||{},p={[a]:r.data.clients?.[a]};a&&"[CHANNEL:TRANSFER]"===l&&(((e,t)=>{o.has(e)&&(o.get(e).port=t),o.has(e)||o.set(e,{id:e,port:t,rewrite:"/"}),t.onmessage=t=>{const r=t.data?.uid,c=t.data?.type,a=t.data?.certs;switch(c){case"[CALL:NET_PING]":s({id:e,uid:r,type:c});break;case"[CALL:CLEAR_CERTER]":i("clear",a),o.forEach((t=>s({id:t.id,uid:t.id===e?r:null,type:t.id===e?c:"[CALL:NET_PING]",certs:Object.fromEntries(n.entries())})));break;case"[CALL:RESET_CERTER]":i("reset",a),o.forEach((t=>s({id:t.id,uid:t.id===e?r:null,type:t.id===e?c:"[CALL:NET_PING]",certs:Object.fromEntries(n.entries())})));break;case"[CALL:UPDATE_CERTER]":i("update",a),o.forEach((t=>s({id:t.id,uid:t.id===e?r:null,type:t.id===e?c:"[CALL:NET_PING]",certs:Object.fromEntries(n.entries())})));break;case"[CALL:REMOVE_CERTER]":i("remove",a),o.forEach((t=>s({id:t.id,uid:t.id===e?r:null,type:t.id===e?c:"[CALL:NET_PING]",certs:Object.fromEntries(n.entries())})));break;case"[CALL:BROADCAST_MESSAGE]":o.forEach(((r,s)=>{s!==e&&o.get(s)?.port.postMessage({...t.data})}))}}})(a,d),i("update",u),c("update",p),c("synchrony",[a]),c("checkup",[a]))})),self.addEventListener("fetch",(t=>{let r="/";const s=t.request,i=NetPing,l=NetDebug,d=NetGateway,u=a.has(s.url),p="navigate"===s.mode,h=NetWhites.some((e=>e.test(s.url))),f=NetProxys.some((e=>e.test(s.url))),E=[NetSubRoute].some((e=>e.test(s.url))),g=[NetSubRoute].some((e=>e.test(s.referrer))),b=t.resultingClientId||t.clientId,y=t.clientId;if(f&&a.has(s.url)&&a.delete(s.url),f&&o.has(b)&&(u||(r=o.get(b)?.rewrite||"/"),u&&o.delete(b)),f&&!o.has(b)&&(!u&&p&&g&&(r=s.referrer.replace(NetSubRoute,"$1")),!u&&p&&E&&(r=s.url.replace(NetSubRoute,"$1")),o.set(b,{id:b,rewrite:r}),c("synchrony",[b]),c("checkup",[b])),f&&d&&p&&!E&&!h&&"/"!==r)return t.respondWith(Response.redirect(s.url.replace(NetSubRewirte,`$1${r}`),302));if(f&&d){const r=async r=>{const s=o.get(b).rewrite,c=h||E?r.url:r.url.replace(NetSubRewirte,`$1${s}`),d=/^(GET|HEAD)$/i.test(r.method)?null:await r.clone().arrayBuffer().catch((()=>null)),u=/^(GET|HEAD)$/i.test(r.method)?null:await r.clone().json().catch((()=>null)),f=Object.fromEntries([...t.request.headers.entries(),...n.entries()]),g=new Request(c,{cache:r.cache,signal:r.signal,method:r.method,priority:r.priority,redirect:p&&["follow","error","manual"].includes(NetRedirect)?NetRedirect:r.redirect,referrer:r.referrer,integrity:r.integrity,keepalive:r.keepalive,credentials:r.credentials,referrerPolicy:r.referrerPolicy,headers:f||{},body:d||null,mode:"same-origin"});if(l){const e=g.url,t=g.method,s=((e="")=>{const t=console.log,r=console.group,s=console.groupEnd;return i=>{t("\n"),r(`------- NetWork: -> ${e} ---------`),i(t),s(),t("\n")}})(r.url);s((r=>{r("[Url] - ",e),r("[Method] - ",t),r("[Headers] - ",f),r("[ParseBody] - ",u)}))}const S=fetch(g),m=self.clients.get(y),N=o.get(y),$=(t,r)=>{const c=e(t),n=r?.headers?.get("redirect-url")?.trim()||N?.redirect?.trim(),l=/(^|;)text\/html(;|$)/.test(r.headers.get("content-type")),d="manual"===g.redirect,u="/"!==s;if(o.get(y)?.redirect&&delete o.get(y).redirect,c||p||!n||(o.get(b).redirect=n),!c&&p&&n){let e=n;const t=/^(https?:\/\/?[^\/]+)(\?[\s\S]*)?$/i.test(e);return!/^(https?:\/\/)?(localhost|127\.0\.0\.1)([:/][\s\S]*)?$/i.test(e)&&(e=e.replace(/^https?:\/\/([\s\S]+(\?[\s\S]*)?)$/i,"https://$1")),t&&(e=e.replace(/^(https?:\/\/[^\/]+)(\?[\s\S]*)?$/i,"$1/$2")),a.add(e),Response.redirect(e,302)}if(c&&n){let e=n;const r=/^(https?:\/\/?[^\/]+)(\?[\s\S]*)?$/i.test(e);return!/^(https?:\/\/)?(localhost|127\.0\.0\.1)([:/][\s\S]*)?$/i.test(e)&&(e=e.replace(/^https?:\/\/([\s\S]+(\?[\s\S]*)?)$/i,"https://$1")),r&&(e=e.replace(/^(https?:\/\/[^\/]+)(\?[\s\S]*)?$/i,"$1/$2")),a.add(e),t.navigate(e)}return S.then((e=>{if(d&&c){const r=e.redirected,i=NetWhites.some((t=>t.test(e.url))),c=NetProxys.some((t=>t.test(e.url))),o=[NetSubRoute].some((t=>t.test(e.url))),n=/^(https?:\/\/?[^\/]+)(\?[\s\S]*)?$/i.test(e.url),l=/^(https?:\/\/)?(localhost|127\.0\.0\.1)([:/][\s\S]*)?$/i.test(e.url);if(r&&c&&!i&&!o){let r=e.url;return!l&&(r=r.replace(/^https?:\/\/([\s\S]+(\?[\s\S]*)?)$/i,"https://$1")),n&&(r=r.replace(/^(https?:\/\/[^\/]+)(\?[\s\S]*)?$/i,"$1/$2")),u&&(r=r.replace(NetSubRewirte,`$1${s}`)),a.add(r),t.navigate(r)}}if(!0!==e.ok||200!==e.status)return e;if(p&&u&&l&&i){const t=/(<\/head>)(?!.*<\/head>)/is,r=NetScripts.join("\n");return e.text().then((s=>new Response(s.replace(t,`${r}\n$1`),{ok:e.ok,url:e.url,type:e.type,status:e.status,headers:e.headers,redirected:e.redirected,statusText:e.statusText})))}return e}))};return Promise.all([m,S]).then((e=>$(...e))).catch((()=>$()))};t.respondWith(r(s))}}));const a=new Set,o=new Map,n=new Map}();
