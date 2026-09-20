import { createContext, useState, useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getToken } from '../utils/storage'
import { useAuth } from '../hooks/useAuth'

export const WebSocketContext = createContext(null)

const WS_URL = import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? 'http://localhost:8080/ws' : '/ws')

export function WebSocketProvider({ children }) {
  const { user } = useAuth()
  const [connected, setConnected] = useState(false)
  const clientRef = useRef(null)
  const subscriptionsRef = useRef(new Map())

  useEffect(() => {
    if (!user) return

    const token = getToken()
    if (!token) return

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log('WebSocket connected')
        setConnected(true)
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected')
        setConnected(false)
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers?.message)
      }
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      clientRef.current = null
      setConnected(false)
    }
  }, [user])

  const subscribe = useCallback((destination, callback) => {
    const client = clientRef.current
    if (!client || !client.connected) {
      console.warn('WebSocket not connected, cannot subscribe to', destination)
      return null
    }

    const subscription = client.subscribe(destination, (message) => {
      try {
        const body = JSON.parse(message.body)
        callback(body)
      } catch {
        callback(message.body)
      }
    })

    subscriptionsRef.current.set(destination, subscription)
    return subscription
  }, [])

  const unsubscribe = useCallback((destination) => {
    const subscription = subscriptionsRef.current.get(destination)
    if (subscription) {
      subscription.unsubscribe()
      subscriptionsRef.current.delete(destination)
    }
  }, [])

  const sendMessage = useCallback((destination, body) => {
    const client = clientRef.current
    if (!client || !client.connected) {
      console.warn('WebSocket not connected, cannot send to', destination)
      return
    }

    client.publish({
      destination,
      body: JSON.stringify(body)
    })
  }, [])

  return (
    <WebSocketContext.Provider value={{ connected, subscribe, unsubscribe, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}
