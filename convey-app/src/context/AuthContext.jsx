import { createContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/authApi'
import { getToken, setToken, removeToken, getUserData, setUserData, removeUserData } from '../utils/storage'
import { generateKeyPair } from '../utils/crypto'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const token = getToken()
    const savedUser = getUserData()
    if (token && savedUser) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const register = useCallback(async (name, phoneNumber, profilePhotoUrl) => {
    try {
      // Generate E2EE keys
      const keys = await generateKeyPair()
      
      const response = await authApi.register({ 
        name, 
        phoneNumber, 
        profilePhotoUrl,
        publicKey: keys.publicKey
      })
      
      // Store private key locally
      localStorage.setItem('convey_private_key', keys.privateKey)
      
      const { token, userId, name: userName, phoneNumber: phone, profilePhotoUrl: photo, newUser } = response.data
      setToken(token)
      const userData = { id: userId, name: userName, phoneNumber: phone, profilePhotoUrl: photo, newUser }
      setUserData(userData)
      setUser(userData)
      return { success: true, newUser }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      return { success: false, error: message }
    }
  }, [])

  const login = useCallback(async (phoneNumber) => {
    try {
      // Generate new E2EE keys for this device (note: past messages won't be decryptable without backup)
      const keys = await generateKeyPair()

      const response = await authApi.login({ 
        phoneNumber,
        publicKey: keys.publicKey // We need to update backend login to accept and update publicKey
      })
      
      localStorage.setItem('convey_private_key', keys.privateKey)

      const { token, userId, name, phoneNumber: phone, profilePhotoUrl, newUser } = response.data
      setToken(token)
      const userData = { id: userId, name, phoneNumber: phone, profilePhotoUrl, newUser }
      setUserData(userData)
      setUser(userData)
      return { success: true, newUser }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(() => {
    removeToken()
    removeUserData()
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      setUserData(updated)
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
