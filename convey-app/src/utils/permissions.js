/**
 * Centralized permission request helpers for Capacitor native plugins.
 * Falls back gracefully in browser environments.
 */

export async function requestCameraPermission() {
  try {
    const { Camera } = await import('@capacitor/camera')
    const result = await Camera.requestPermissions()
    return result.camera === 'granted' || result.photos === 'granted'
  } catch {
    console.warn('Camera plugin not available')
    return true // Allow in browser
  }
}

export async function requestContactsPermission() {
  try {
    const { Contacts } = await import('@capacitor-community/contacts')
    const result = await Contacts.requestPermissions()
    return result.contacts === 'granted'
  } catch {
    console.warn('Contacts plugin not available')
    return true
  }
}

export async function requestMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(t => t.stop())
    return true
  } catch {
    return false
  }
}

export async function requestLocationPermission() {
  try {
    const result = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000 }
      )
    })
    return result
  } catch {
    return false
  }
}

export async function requestNotificationPermission() {
  try {
    if ('Notification' in window) {
      // Use Promise.race to prevent hanging if the prompt is suppressed or ignored
      const result = await Promise.race([
        Notification.requestPermission(),
        new Promise(resolve => setTimeout(() => resolve('denied'), 4000))
      ])
      return result === 'granted'
    }
    return false
  } catch {
    return false
  }
}
