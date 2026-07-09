import { ref } from 'vue'
import { authRecipient } from '../api/driverLocation'

// Live driver location for the public tracking page. Two independent
// sources, matching how the rest of the system already handles this:
//
// - Fleetable/Uber orders: no connection of our own — the coordinates
//   arrive as part of core-api's already-polling delivery response
//   (delivery.fleetableLocation), so `update()` just mirrors them in.
// - In-house-driver orders: a WebSocket straight to driver-location-service,
//   replicating the flow deliveryappadmin's non-fleetable tracking path
//   already uses (components/orders/Map.vue) — fetch a short-lived
//   location auth token via the public /api/auth/recipient endpoint, then
//   subscribe to `location.track.{token}` over the Pusher wire protocol.
export function useDriverLocation() {
  const driverPosition = ref(null) // { lat, lng } | null
  const trackingStatus = ref('unavailable') // 'unavailable' | 'connecting' | 'live' | 'offline'

  let socket = null
  let currentToken = null
  let currentCode = null
  let fulfilmentType = null

  function buildWebSocketUrl() {
    const baseURL =
      window.__APP_CONFIG__?.DRIVER_LOCATION_SERVICE_URL ||
      import.meta.env.VITE_DRIVER_LOCATION_SERVICE_URL ||
      ''
    const httpUrl = new URL(baseURL)
    const protocol = httpUrl.protocol === 'https:' ? 'wss' : 'ws'
    const wsPort = import.meta.env.VITE_DRIVER_LOCATION_SERVICE_WS_PORT
    const host = wsPort ? `${httpUrl.hostname}:${wsPort}` : httpUrl.host

    return `${protocol}://${host}/app/track-location`
  }

  function channelName(token) {
    return `location.track.${token}`
  }

  function parseMessageData(data) {
    if (typeof data !== 'string') return data || {}

    try {
      return JSON.parse(data)
    } catch {
      return {}
    }
  }

  function updatePositionFrom(data) {
    const lat = Number.parseFloat(data.latitude)
    const lng = Number.parseFloat(data.longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return

    driverPosition.value = { lat, lng }
    trackingStatus.value = 'live'
  }

  function connectSocket(token) {
    const socketConnection = new WebSocket(buildWebSocketUrl())

    socketConnection.onopen = () => {
      socketConnection.send(
        JSON.stringify({ event: 'pusher:subscribe', data: { channel: channelName(token) } }),
      )
    }

    socketConnection.onclose = () => {
      // Ignore — this connection has already been superseded/torn down.
      if (socket !== socketConnection) return
      trackingStatus.value = 'offline'
    }

    socketConnection.onerror = (event) => {
      console.error('driver-location-service websocket error', event)
    }

    socketConnection.onmessage = (event) => {
      const message = JSON.parse(event.data)
      const data = parseMessageData(message.data)

      switch (message.event) {
        case 'pusher:error':
          console.error(`driver-location-service websocket error: ${data.message}`)
          stop()
          break

        case 'location.updated':
          updatePositionFrom(data)
          break

        case 'location-auth-token.expired':
          refreshToken()
          break
      }
    }

    socket = socketConnection
    currentToken = token
  }

  async function refreshToken() {
    if (!currentCode || !socket) return

    const previousToken = currentToken
    trackingStatus.value = 'connecting'

    if (previousToken && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          event: 'pusher:unsubscribe',
          data: { channel: channelName(previousToken) },
        }),
      )
    }

    try {
      const { location_auth_token: token } = await authRecipient(currentCode)
      currentToken = token

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ event: 'pusher:subscribe', data: { channel: channelName(token) } }),
        )
      } else {
        connectSocket(token)
      }
    } catch {
      trackingStatus.value = 'offline'
    }
  }

  async function startInHouseTracking(code) {
    currentCode = code
    trackingStatus.value = 'connecting'

    try {
      const { location_auth_token: token } = await authRecipient(code)
      connectSocket(token)
    } catch {
      trackingStatus.value = 'offline'
    }
  }

  function updateFromFleetable(delivery) {
    if (delivery.fleetableLocation) {
      driverPosition.value = delivery.fleetableLocation
      trackingStatus.value = 'live'
    } else {
      trackingStatus.value = 'connecting'
    }
  }

  function start(delivery) {
    stop()
    fulfilmentType = delivery.fulfilmentType

    if (fulfilmentType === 'fleetable') {
      updateFromFleetable(delivery)
    } else {
      startInHouseTracking(delivery.code)
    }
  }

  // Called whenever the (already-polling) delivery ref updates, so fleetable
  // coordinates stay fresh without opening any connection of our own.
  function update(delivery) {
    if (fulfilmentType === 'fleetable') {
      updateFromFleetable(delivery)
    }
  }

  function stop() {
    if (socket) {
      socket.close()
      socket = null
    }

    currentToken = null
    currentCode = null
    fulfilmentType = null
    driverPosition.value = null
    trackingStatus.value = 'unavailable'
  }

  return { driverPosition, trackingStatus, start, update, stop }
}
