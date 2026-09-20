import client from './client'

export const registerDevice = async (fcmToken, platform) => {
  return client.post('/api/devices', { fcmToken, platform })
}

export const unregisterDevice = async (fcmToken) => {
  return client.delete(`/api/devices/${fcmToken}`)
}
