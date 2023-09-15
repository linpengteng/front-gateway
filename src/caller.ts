/* eslint-disable prefer-promise-reject-errors */

const isPureObject = (any: any) => Object.prototype.toString.call(any) === '[object Object]'
const windowReady = new Promise(resolve => window.addEventListener('load', resolve))
const isLocalhost = /^localhost$|^127\.0\.0\.1$/i.test(window.location.hostname)
const isSecurity = /^https:\/\/[\s\S]+/i.test(window.location.href)

const NetCaller = () => {
  let uid: number
  let timer: number
  let Queuer: Map<any, any>
  let Certer: Map<any, any>
  let Clients: Map<any, any>
  let Listener: Set<Function>
  let Notifier: Record<any, any>
  let Messager: MessageChannel
  let Promiser: Promise<void>

  const verifier = async(url: any) => {
    if (!('serviceWorker' in window.navigator)) {
      return Promise.reject(new Error(`The current browser does not support Service worker`))
    }

    return fetch(url)
      .then(response => {
        if (response.status === 404) return Promise.reject(new Error(`Service worker not found at ${url}`))
        if (response.headers.get('content-type')?.indexOf('javascript') === -1) return Promise.reject(new Error(`Expected ${url} to have javascript content-type, but received ${response.headers.get('content-type')}`))
      })
  }

  const register = async(url: any) => {
    if ('serviceWorker' in window.navigator) {
      const pinger = (port: MessagePort) => {
        window.clearTimeout(timer)
        const ping = messager('[CALL:NET_PING]', {})
        const wait = new Promise(resolve => { timer = window.setTimeout(resolve, 3000) })
        Promise.all([ping, wait]).then(() => { pinger(port) }).catch(() => { register(url) })
      }

      const listener = (port: MessagePort) => {
        port.onmessage = event => {
          if (typeof event.data !== 'object') {
            return
          }

          if (!event.data) {
            return
          }

          const id = event.data.id
          const uid = event.data.uid
          const type = event.data.type
          const certs = event.data.certs
          const error = event.data.error
          const result = event.data.result
          const clients = event.data.clients
          const client = Clients.get(id) || null

          prompter(type, { error, result })

          if (uid && Queuer.has(uid)) {
            Queuer.get(uid)({ type, error, result })
            Queuer.delete(uid)
          }

          if (isPureObject(clients)) {
            Clients = new Map(Object.entries(clients))
          }

          if (isPureObject(client)) {
            Clients.set(id, client)
          }

          if (isPureObject(certs)) {
            Certer = new Map(Object.entries(certs))
          }
        }
      }

      window.navigator.serviceWorker.oncontrollerchange = (event: any) => {
        if (event.target?.controller instanceof ServiceWorker) {
          Queuer.get(0)?.resolve()
          Messager = new MessageChannel()
          event.target.controller.postMessage({ type: '[CHANNEL:TRANSFER]', certs: Object.fromEntries(Certer.entries()), clients: Object.fromEntries(Clients.entries()) }, [Messager.port2])
          event.target.controller.onerror = () => register(url)
          listener(Messager.port1)
          pinger(Messager.port1)
        }
      }

      return window.navigator.serviceWorker.register(url)
        .then(registration => {
          if (!registration) {
            return
          }

          registration.onupdatefound = () => {
            prompter('[WORKER:UPDATEFOUND]')
          }

          if (registration) prompter('[WORKER:REGISTERED]')
          if (registration.waiting) prompter('[WORKER:UPDATED]')
          if (registration.active) {
            Queuer.get(0)?.resolve()
            Messager = new MessageChannel()
            registration.active.postMessage({ type: '[CHANNEL:TRANSFER]', certs: Object.fromEntries(Certer.entries()), clients: Object.fromEntries(Clients.entries()) }, [Messager.port2])
            registration.active.onerror = () => register(url)
            prompter('[WORKER:ACTIVED]')
            listener(Messager.port1)
            pinger(Messager.port1)
          }
        })
    }
  }

  const prompter = async(type: any, options?: any) => {
    if (type) {
      Listener.forEach(listener => listener({ type, error: null, result: null, ...options }))
    }
  }

  const messager = async(type: any, options: any) => {
    const NoWaitResponse = [
      '[CALL:BROADCAST_MESSAGE]'
    ]

    if (NoWaitResponse.includes(type)) {
      return Promiser.then(() => {
        Messager.port1.postMessage({
          ...options,
          type: type,
          uid: null
        })
        return { error: null, result: null }
      })
    }

    return Promiser.then(() => {
      const id = uid++

      const promise = new Promise((resolve, reject) => {
        Queuer.set(id, resolve)
        setTimeout(() => { Queuer.delete(id) }, 1500)
        setTimeout(() => { reject({ type, error: new Error('Message timeout'), result: null }) }, 1500)
      })

      Messager.port1.postMessage({
        ...options,
        type: type,
        uid: id
      })

      return promise
    })
  }

  return (url: any, optioner: any) => {
    if (!Notifier) {
      uid = 1
      Queuer = new Map()
      Certer = new Map()
      Clients = new Map()
      Listener = new Set()
      Promiser = new Promise((resolve, reject) => Queuer.set(0, { resolve, reject }))
      optioner = Object.assign({}, optioner)

      Notifier = {
        clearCerter: optioner.clearCerter !== false ? (certs?: any) => messager('[CALL:CLEAR_CERTER]', { certs }) : () => {},
        resetCerter: optioner.resetCerter !== false ? (certs?: any) => messager('[CALL:RESET_CERTER]', { certs }) : () => {},
        updateCerter: optioner.updateCerter !== false ? (certs?: any) => messager('[CALL:UPDATE_CERTER]', { certs }) : () => {},
        removeCerter: optioner.removeCerter !== false ? (certs?: any) => messager('[CALL:REMOVE_CERTER]', { certs }) : () => {},
        broadcastMessage: optioner.broadcastMessage === true ? (options?: any) => messager('[CALL:BROADCAST_MESSAGE]', options) : () => {},
        registerListener: optioner.registerListener === true ? (listener?: any) => { typeof listener === 'function' ? Listener.add(listener) : null } : () => {},
        removeListener: optioner.removeListener === true ? (listener?: any) => { typeof listener === 'function' ? Listener.delete(listener) : null } : () => {},
        clearListener: optioner.clearListener === true ? (_?: any) => { Listener.clear() } : () => {}
      }

      windowReady.then(async() => {
        try {
          if (!isLocalhost && !isSecurity) {
            prompter('[WORKER:ERROR]', { error: new Error(`Accessing pages are not local hosts and unsafe HTTP requests`) })
            Queuer.get(0)?.reject(new Error(`Accessing pages are not local hosts and unsafe HTTP requests`))
            return
          }
          await verifier(url)
          await register(url)
        } catch (error) {
          prompter('[WORKER:ERROR]', { error })
        }
      })
    }

    return Notifier
  }
}

export default NetCaller()
