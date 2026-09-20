import { useContext, useEffect, useCallback } from 'react'
import { WebSocketContext } from '../context/WebSocketContext'

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

/**
 * Hook to subscribe to a user's personal message queue.
 * Automatically subscribes on mount and unsubscribes on unmount.
 */
export function useMessageSubscription(userId, onMessage) {
  const { connected, subscribe, unsubscribe } = useWebSocket()

  useEffect(() => {
    if (!connected || !userId) return

    const destination = `/user/${userId}/queue/messages`
    subscribe(destination, onMessage)

    return () => {
      unsubscribe(destination)
    }
  }, [connected, userId, onMessage, subscribe, unsubscribe])
}
