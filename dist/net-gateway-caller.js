!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).NetCaller=t()}(this,(function(){"use strict";const e=e=>"[object Object]"===Object.prototype.toString.call(e),t=new Promise((e=>window.addEventListener("load",e))),r=/^localhost$|^127\.0\.0\.1$/i.test(window.location.hostname),s=/^https:\/\/[\s\S]+/i.test(window.location.href);return(()=>{let n,o,a,i,c,l,d,u,p;const E=async t=>{if("serviceWorker"in window.navigator){const r=e=>{window.clearTimeout(o);const s=g("[CALL:NET_PING]",{}),n=new Promise((e=>{o=window.setTimeout(e,1e4)}));Promise.all([s,n]).then((()=>{r()})).catch((()=>{E(t)}))},s=t=>{t.onmessage=t=>{if("object"!=typeof t.data)return;if(!t.data)return;const r=t.data.id,s=t.data.uid,n=t.data.type,o=t.data.certs,l=t.data.error,d=t.data.result,u=t.data.clients,p=c.get(r)||null;w(n,{error:l,result:d}),s&&a.has(s)&&(a.get(s)({type:n,error:l,result:d}),a.delete(s)),e(u)&&(c=new Map(Object.entries(u))),e(p)&&c.set(r,p),e(o)&&(i=new Map(Object.entries(o)))}};return window.navigator.serviceWorker.oncontrollerchange=e=>{e.target?.controller?.postMessage&&(a.get(0)?.resolve(),u=new MessageChannel,e.target.controller.postMessage({type:"[CHANNEL:TRANSFER]",certs:Object.fromEntries(i.entries()),clients:Object.fromEntries(c.entries())},[u.port2]),s(u.port1),r(u.port1))},window.navigator.serviceWorker.register(t).then((e=>{e&&(e.onupdatefound=()=>{w("[WORKER:UPDATEFOUND]")},e&&w("[WORKER:REGISTERED]"),e.waiting&&w("[WORKER:UPDATED]"),e.active&&(a.get(0)?.resolve(),u=new MessageChannel,e.active.postMessage({type:"[CHANNEL:TRANSFER]",certs:Object.fromEntries(i.entries()),clients:Object.fromEntries(c.entries())},[u.port2]),w("[WORKER:ACTIVED]"),s(u.port1),r(u.port1)))}))}},w=async(e,t)=>{e&&l.forEach((r=>r({type:e,error:null,result:null,...t})))},g=async(e,t)=>["[CALL:BROADCAST_MESSAGE]"].includes(e)?p.then((()=>(u.port1.postMessage({...t,type:e,uid:null}),{error:null,result:null}))):p.then((()=>{const r=n++,s=new Promise(((t,s)=>{a.set(r,t),setTimeout((()=>{a.delete(r)}),1500),setTimeout((()=>{s({type:e,error:new Error("Message timeout"),result:null})}),1500)}));return u.port1.postMessage({...t,type:e,uid:r}),s}));return(e,o)=>(d||(n=1,a=new Map,i=new Map,c=new Map,l=new Set,p=new Promise(((e,t)=>a.set(0,{resolve:e,reject:t}))),o=Object.assign({},o),d={clearCerter:!1!==o.clearCerter?e=>g("[CALL:CLEAR_CERTER]",{certs:e}):()=>{},resetCerter:!1!==o.resetCerter?e=>g("[CALL:RESET_CERTER]",{certs:e}):()=>{},updateCerter:!1!==o.updateCerter?e=>g("[CALL:UPDATE_CERTER]",{certs:e}):()=>{},removeCerter:!1!==o.removeCerter?e=>g("[CALL:REMOVE_CERTER]",{certs:e}):()=>{},broadcastMessage:!0===o.broadcastMessage?e=>g("[CALL:BROADCAST_MESSAGE]",e):()=>{},registerListener:!0===o.registerListener?e=>{"function"==typeof e&&l.add(e)}:()=>{},removeListener:!0===o.removeListener?e=>{"function"==typeof e&&l.delete(e)}:()=>{},clearListener:!0===o.clearListener?e=>{l.clear()}:()=>{}},t.then((async()=>{try{if(!r&&!s)return w("[WORKER:ERROR]",{error:new Error("Accessing pages are not local hosts and unsafe HTTP requests")}),void a.get(0)?.reject(new Error("Accessing pages are not local hosts and unsafe HTTP requests"));await(async e=>"serviceWorker"in window.navigator?fetch(e).then((t=>404===t.status?Promise.reject(new Error(`Service worker not found at ${e}`)):-1===t.headers.get("content-type")?.indexOf("javascript")?Promise.reject(new Error(`Expected ${e} to have javascript content-type, but received ${t.headers.get("content-type")}`)):void 0)):Promise.reject(new Error("The current browser does not support Service worker")))(e),await E(e)}catch(e){w("[WORKER:ERROR]",{error:e})}}))),d)})()}));