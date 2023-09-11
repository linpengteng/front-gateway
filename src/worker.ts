// @ts-nocheck
/* eslint-disable */

importScripts('/net-gateway-config.js')

const isWindowClient = any => Object.prototype.toString.call(any) === '[object WindowClient]'
const isString = any => Object.prototype.toString.call(any) === '[object String]'
const isObject = any => Object.prototype.toString.call(any) === '[object Object]'
const isArray = any => Object.prototype.toString.call(any) === '[object Array]'


const messager = (options = {}) => {
  if (NetClients.has(options?.id)) {
    NetClients.get(options.id).port?.postMessage({
      id: options.id,
      uid: options.uid,
      type: options.type,
      certs: options?.certs || null,
      clients: options?.clients || null,
      result: options?.result || null,
      error: options?.error || null,
    })
  }
}

const storager = (key, opts = {}) => {
  switch (key) {
    case 'clear': {
      NetCerters.clear()
      break
    }

    case 'reset': {
      NetCerters.clear()

      if (isObject(opts)) {
        for (const key in opts) {
          NetCerters.set(key, opts[key])
        }
      }

      break
    }

    case 'update': {
      if (isObject(opts)) {
        for (const key in opts) {
          NetCerters.set(key, opts[key])
        }
      }
      break
    }

    case 'remove': {
      if (isArray(opts)) {
        for (const key of opts) {
          NetCerters.delete(key)
        }
      }

      if (isObject(opts)) {
        for (const key in opts) {
          NetCerters.delete(key)
        }
      }

      break
    }
  }
}

const clienter =  (key, opts = {}) => {
  switch (key) {
    case 'clear': {
      NetClients.clear()
      break
    }

    case 'reset': {
      NetClients.clear()

      if (isObject(opts)) {
        for (const key in opts) {
          NetClients.set(key, { ...NetClients.get(key), ...opts[key], port: NetClients.get(key)?.port  })
        }
      }

      break
    }

    case 'update': {
      if (isObject(opts)) {
        for (const key in opts) {
          NetClients.set(key, { ...NetClients.get(key), ...opts[key], port: NetClients.get(key)?.port  })
        }
      }
      break
    }

    case 'remove': {
      if (isArray(opts)) {
        for (const key of opts) {
          NetClients.delete(key)
        }
      }

      if (isObject(opts)) {
        for (const key in opts) {
          NetClients.delete(key)
        }
      }

      break
    }

    case 'checkup': {
      self.clients.matchAll().then(list => {
        const skips = isObject(opts) 
          ? Object.keys(opts)
          : isArray(opts)
            ? opts
            : []
        
        for (const key of NetClients.keys()) {
          const skiped = skips.some(id => key === id)
          const focused = list.some(client => key === client.id)

          if (!skiped && !focused) {
            NetClients.delete(key)
          }
        }
      })
      break
    }

    case 'synchrony': {
      const syncs = isObject(opts) 
        ? Object.keys(opts)
        : isArray(opts)
          ? opts
          : []

      for (const key of syncs) {
        if (isString(key)) {
          messager({
            id: key,
            uid: '[NET_SYNC_ID]',
            type: '[CALL:NET_SYNC]',
            certs: Object.fromEntries(NetCerters.entries()),
            clients: { [key]: { ...NetClients.get(key), port: null } }
          })
        }
      }
      break
    }
  }
}

const register = (id, port) => {
  if (NetClients.has(id)) {
    NetClients.get(id).port = port
  }

  if (!NetClients.has(id)) {
    NetClients.set(id, { id, port, rewrite: '/' })
  }

  port.onmessage = event => {
    const uid = event.data?.uid
    const type = event.data?.type
    const certs = event.data?.certs

    switch (type) {
      case '[CALL:NET_PING]': {
        messager({ id, uid, type })
        break
      }

      case '[CALL:CLEAR_CERTER]': {
        storager('clear', certs)

        NetClients.forEach(it => messager({
          id: it.id,
          uid: it.id === id ? uid : null,
          type: it.id === id ? type : '[CALL:NET_PING]',
          certs: Object.fromEntries(NetCerters.entries())
        }))

        break
      }

      case '[CALL:RESET_CERTER]': {
        storager('reset', certs)

        NetClients.forEach(it => messager({
          id: it.id,
          uid: it.id === id ? uid : null,
          type: it.id === id ? type : '[CALL:NET_PING]',
          certs: Object.fromEntries(NetCerters.entries())
        }))

        break
      }

      case '[CALL:UPDATE_CERTER]': {
        storager('update', certs)

        NetClients.forEach(it => messager({
          id: it.id,
          uid: it.id === id ? uid : null,
          type: it.id === id ? type : '[CALL:NET_PING]',
          certs: Object.fromEntries(NetCerters.entries())
        }))

        break
      }

      case '[CALL:REMOVE_CERTER]': {
        storager('remove', certs)

        NetClients.forEach(it => messager({
          id: it.id,
          uid: it.id === id ? uid : null,
          type: it.id === id ? type : '[CALL:NET_PING]',
          certs: Object.fromEntries(NetCerters.entries())
        }))

        break
      }

      case '[CALL:BROADCAST_MESSAGE]': {
        NetClients.forEach((port, key) => { key !== id && NetClients.get(key)?.port.postMessage({ ...event.data }) })
        break
      }
    }
  }
}

const printer = (url = '') => {
  const log = console.log
  const group = console.group
  const groupEnd = console.groupEnd

  return printer => {
    log('\n')
    group(`------- NetWork: -> ${url} ---------`)
    printer(log)
    groupEnd()
    log('\n')
  }
}


self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', event => {
  if (!isWindowClient(event.source)) {
    return
  }

  if (!isObject(event.data)) {
    return
  }

  const id = event.source.id
  const uid = event.data.uid
  const type = event.data.type
  const port = event.ports[0]
  const certs = event.data.certs || {}
  const clients = { [id]: event.data.clients?.[id] }

  if (id && type === '[CHANNEL:TRANSFER]') {
    register(id, port)

    storager('update', certs)
    clienter('update', clients)
    clienter('synchrony', [id])
    clienter('checkup', [id])
  }
})

self.addEventListener('fetch', event => {
  let rewrite = '/'

  const request = event.request
  const isDebugger = NetDebug
  const isOnGateway = NetGateway
  const isNewWindow = NewWindows.has(request.url)
  const isNavigated = request.mode === 'navigate'
  const isMatchWhited = NetWhites.some(regex => regex.test(request.url))
  const isMatchRequest = NetProxys.some(regex => regex.test(request.url))
  const isMatchAppRoute = [NetSubRoute].some(regex => regex.test(request.url))
  const isMatchAppRefer = [NetSubRoute].some(regex => regex.test(request.referrer))
  const properClientId = event.resultingClientId || event.clientId
  const latestClientId = event.clientId

  if (isMatchRequest && NewWindows.has(request.url)) {
    NewWindows.delete(request.url)
  }

  if (isMatchRequest && NetClients.has(properClientId)) {
    isNewWindow || (rewrite = NetClients.get(properClientId)?.rewrite || '/')
    isNewWindow && NetClients.delete(properClientId)
  }

  if (isMatchRequest && !NetClients.has(properClientId)) {
    !isNewWindow && isNavigated && isMatchAppRefer && (rewrite = request.referrer.replace(NetSubRoute, '$1'))
    !isNewWindow && isNavigated && isMatchAppRoute && (rewrite = request.url.replace(NetSubRoute, '$1'))
    NetClients.set(properClientId, { id: properClientId, rewrite: rewrite })
    clienter('synchrony', [properClientId])
    clienter('checkup', [properClientId])
  }

  if (isMatchRequest && isOnGateway && isNavigated && !isMatchAppRoute && !isMatchWhited && rewrite !== '/') {
    return event.respondWith(Response.redirect(request.url.replace(NetSubRewirte, `$1${rewrite}`), 302))
  }

  if (isMatchRequest && isOnGateway) {
    const interceptor = async request => {
      const rewrite = NetClients.get(properClientId).rewrite
      const newRoute = !isMatchWhited && !isMatchAppRoute ? request.url.replace(NetSubRewirte, `$1${rewrite}`) : request.url
      const newBufferBody = !/^(GET|HEAD)$/i.test(request.method) ? await request.clone().arrayBuffer().catch(() => null) : null
      const newParseBody = !/^(GET|HEAD)$/i.test(request.method) ? await request.clone().json().catch(() => null) : null
      const newHeaders = Object.fromEntries([...event.request.headers.entries(), ...NetCerters.entries()])

      const newRequest = new Request(newRoute, {
        cache: request.cache,
        signal: request.signal,
        method: request.method,
        priority: request.priority,
        redirect: isNavigated && ['follow', 'error', 'manual'].includes(NetRedirect) ? NetRedirect : request.redirect,
        referrer: request.referrer,
        integrity: request.integrity,
        keepalive: request.keepalive,
        credentials: request.credentials,
        referrerPolicy: request.referrerPolicy,
        headers: newHeaders || {},
        body: newBufferBody || null,
        mode: 'same-origin'
      })

      if (isDebugger) {
        const newUrl = newRequest.url
        const newMethod = newRequest.method
        const newPrinter = printer(request.url)

        newPrinter(print => {
          print('[Url] - ', newUrl)
          print('[Method] - ', newMethod)
          print('[Headers] - ', newHeaders)
          print('[ParseBody] - ', newParseBody)
        })
      }

      const fetchPromise = fetch(newRequest)
      const clientPromise = self.clients.get(latestClientId)
      const servicerClient = NetClients.get(latestClientId)

      const responder = (client, response) => {
        const isWinClient = isWindowClient(client)
        const urlRedirect = response?.headers?.get('redirect-url')?.trim() || servicerClient?.redirect?.trim()
        const isManualed = newRequest.redirect === 'manual'
        const isRewrited = rewrite !== '/'

        if (NetClients.get(latestClientId)?.redirect) {
          delete NetClients.get(latestClientId).redirect
        }

        if (!isWinClient && !isNavigated && urlRedirect) {
          NetClients.get(properClientId).redirect = urlRedirect
        }

        if (!isWinClient && isNavigated && urlRedirect) {
          let redirect = urlRedirect

          const isRouteHost = (/^(https?:\/\/?[^\/]+)(\?[\s\S]*)?$/i).test(redirect)
          const isLocalhost = (/^(https?:\/\/)?(localhost|127\.0\.0\.1)([:/][\s\S]*)?$/i).test(redirect)

          !isLocalhost && (redirect = redirect.replace(/^https?:\/\/([\s\S]+(\?[\s\S]*)?)$/i, 'https://$1'))
          isRouteHost && (redirect = redirect.replace(/^(https?:\/\/[^\/]+)(\?[\s\S]*)?$/i, '$1/$2'))
    
          return (NewWindows.add(redirect), Response.redirect(redirect, 302))
        }

        if (isWinClient && urlRedirect) {
          let redirect = urlRedirect

          const isRouteHost = (/^(https?:\/\/?[^\/]+)(\?[\s\S]*)?$/i).test(redirect)
          const isLocalhost = (/^(https?:\/\/)?(localhost|127\.0\.0\.1)([:/][\s\S]*)?$/i).test(redirect)

          !isLocalhost && (redirect = redirect.replace(/^https?:\/\/([\s\S]+(\?[\s\S]*)?)$/i, 'https://$1'))
          isRouteHost && (redirect = redirect.replace(/^(https?:\/\/[^\/]+)(\?[\s\S]*)?$/i, '$1/$2'))

          return (NewWindows.add(redirect), client.navigate(redirect))
        }

        return fetchPromise.then(response => {
          /**
           * Unrealized, because we don't want got next redirect url: 
           *  "manual" —— 允许手动处理 HTTP 重定向
           *  "manual" —— 在重定向的情况下，我们将获得一个特殊的响应对象
           *  "manual" —— 其中包含 response.type="opaqueredirect" 和归零/空状态以及大多数其他属性
           */
          if (isManualed && isWinClient) {
            const isRedirected = response.redirected
            const isMatchWhited = NetWhites.some(regex => regex.test(response.url))
            const isMatchRequest = NetProxys.some(regex => regex.test(response.url))
            const isMatchAppRoute = [NetSubRoute].some(regex => regex.test(response.url))

            const isRouteHost = (/^(https?:\/\/?[^\/]+)(\?[\s\S]*)?$/i).test(response.url)
            const isLocalhost = (/^(https?:\/\/)?(localhost|127\.0\.0\.1)([:/][\s\S]*)?$/i).test(response.url)

            if (isRedirected && isMatchRequest && !isMatchWhited && !isMatchAppRoute) {
              let url = response.url

              !isLocalhost && (url = url.replace(/^https?:\/\/([\s\S]+(\?[\s\S]*)?)$/i, 'https://$1'))
              isRouteHost && (url = url.replace(/^(https?:\/\/[^\/]+)(\?[\s\S]*)?$/i, '$1/$2'))
              isRewrited && (url = url.replace(NetSubRewirte, `$1${rewrite}`))

              return (NewWindows.add(url), client.navigate(url))
            }
          }

          return response
        })
      }

      return Promise.all([clientPromise, fetchPromise])
        .then(reset => responder(...reset))
        .catch(() => responder())
    }

    event.respondWith(interceptor(request))
  }
})


const NewWindows = new Set()
const NetClients = new Map()
const NetCerters = new Map()