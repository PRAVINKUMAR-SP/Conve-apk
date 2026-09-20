const TOKEN_KEY = 'convey_token'
const USER_KEY = 'convey_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUserData() {
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setUserData(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUserData() {
  localStorage.removeItem(USER_KEY)
}

/**
 * Generic key-value storage.
 * In production with Capacitor, replace with @capacitor/preferences for native storage.
 */
export function setItem(key, value) {
  localStorage.setItem(`convey_${key}`, JSON.stringify(value))
}

export function getItem(key) {
  try {
    const data = localStorage.getItem(`convey_${key}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function removeItem(key) {
  localStorage.removeItem(`convey_${key}`)
}
