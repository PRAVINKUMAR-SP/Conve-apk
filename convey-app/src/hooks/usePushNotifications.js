import { useEffect } from 'react'
import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'
import { registerDevice } from '../api/deviceApi'

export const usePushNotifications = (isAuthenticated) => {
  useEffect(() => {
    if (!isAuthenticated) return

    // PushNotifications is only available on native devices
    if (Capacitor.isNativePlatform()) {
      registerPush()
    }
  }, [isAuthenticated])

  const registerPush = async () => {
    try {
      let permStatus = await PushNotifications.checkPermissions()

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions()
      }

      if (permStatus.receive !== 'granted') {
        console.warn('User denied push notification permissions')
        return
      }

      await PushNotifications.register()

      // Listen for token registration
      PushNotifications.addListener('registration', async (token) => {
        console.log('Push registration success, token:', token.value)
        try {
          await registerDevice(token.value, Capacitor.getPlatform().toUpperCase())
        } catch (e) {
          console.error('Failed to send FCM token to backend', e)
        }
      })

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on push registration:', error)
      })

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification)
        // Optionally show in-app toast if app is open
      })

      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Push action performed: ', action)
        // Optionally navigate to specific chat based on action.notification.data
      })

    } catch (e) {
      console.error('Error setting up push notifications', e)
    }
  }
}
