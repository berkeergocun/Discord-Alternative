// WebSocket composable – singleton bağlantı, tüm uygulama paylaşır
type WsHandler = (data: any) => void

const socket = ref<WebSocket | null>(null)
const isConnected = ref(false)
const isIdentified = ref(false)
const handlers = reactive<Record<string, WsHandler[]>>({})
let heartbeatTimer: ReturnType<typeof setInterval> | null = null

function dispatch(event: string, data: any) {
  ;(handlers[event] ?? []).forEach(fn => fn(data))
}

export const useWebSocket = () => {
  function connect(token: string) {
    if (socket.value && socket.value.readyState <= WebSocket.OPEN) return

    const ws = new WebSocket('ws://localhost/ws')
    socket.value = ws

    ws.onopen = () => {
      isConnected.value = true
      ws.send(JSON.stringify({ op: 'IDENTIFY', data: { token } }))

      // heartbeat her 30 saniyede bir
      heartbeatTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ op: 'HEARTBEAT', data: null }))
        }
      }, 30_000)
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        const op: string = msg.op
        const evtName: string = msg.event

        if (op === 'READY') {
          isIdentified.value = true
          dispatch('ready', msg.data)
        } else if (op === 'HEARTBEAT_ACK') {
          // pong
        } else if (evtName) {
          // server → client events (message.create, typing.start, presence.update …)
          dispatch(evtName, msg.data)
        }
      } catch {
        // ignore malformed messages
      }
    }

    ws.onerror = () => {
      console.warn('[WS] bağlantı hatası')
    }

    ws.onclose = () => {
      isConnected.value = false
      isIdentified.value = false
      if (heartbeatTimer) clearInterval(heartbeatTimer)
      // 5 saniye sonra yeniden bağlan
      setTimeout(() => {
        const storedToken = typeof window !== 'undefined'
          ? localStorage.getItem('discord_access_token')
          : null
        if (storedToken) connect(storedToken)
      }, 5_000)
    }
  }

  function disconnect() {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    socket.value?.close()
    socket.value = null
    isConnected.value = false
    isIdentified.value = false
  }

  function on(event: string, handler: WsHandler) {
    if (!handlers[event]) handlers[event] = []
    if (!handlers[event].includes(handler)) {
      handlers[event].push(handler)
    }
  }

  function off(event: string, handler: WsHandler) {
    if (!handlers[event]) return
    handlers[event] = handlers[event].filter(fn => fn !== handler)
  }

  function subscribeGuild(guildId: string) {
    socket.value?.send(JSON.stringify({ op: 'GUILD_SUBSCRIBE', data: { guildId } }))
  }

  return { connect, disconnect, on, off, subscribeGuild, isConnected, isIdentified }
}
