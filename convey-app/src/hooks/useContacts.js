import { useState, useCallback } from 'react'

/**
 * Hook for reading device contacts via Capacitor.
 * Falls back gracefully when running in a browser (non-native environment).
 */
export function useContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const requestPermission = useCallback(async () => {
    try {
      // Dynamically import to avoid errors when Capacitor plugins aren't available
      const { Contacts } = await import('@capacitor-community/contacts')
      const permission = await Contacts.requestPermissions()
      const granted = permission.contacts === 'granted'
      setPermissionGranted(granted)
      return granted
    } catch (error) {
      console.warn('Contacts plugin not available (running in browser?):', error.message)
      setPermissionGranted(false)
      return false
    }
  }, [])

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const { Contacts } = await import('@capacitor-community/contacts')
      const result = await Contacts.getContacts({
        projection: {
          name: true,
          phones: true,
          image: false
        }
      })

      const parsed = (result.contacts || [])
        .filter(c => c.phones && c.phones.length > 0)
        .map(c => ({
          name: c.name?.display || c.name?.given || 'Unknown',
          phoneNumbers: c.phones.map(p => p.number).filter(Boolean)
        }))

      setContacts(parsed)
      return parsed
    } catch (error) {
      console.warn('Failed to fetch contacts:', error.message)

      // Return mock contacts for browser testing
      const mockContacts = [
        { name: 'Arun Kumar', phoneNumbers: ['+919876511111'] },
        { name: 'Ravi', phoneNumbers: ['+919876533333'] },
        { name: 'Kumar', phoneNumbers: ['+919876522222'] },
        { name: 'Suresh', phoneNumbers: ['+919876544444'] }
      ]
      setContacts(mockContacts)
      return mockContacts
    } finally {
      setLoading(false)
    }
  }, [])

  return { contacts, loading, permissionGranted, requestPermission, fetchContacts }
}
