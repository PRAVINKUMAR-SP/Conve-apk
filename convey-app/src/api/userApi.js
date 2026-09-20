import client from './client'

export const userApi = {
  getMyProfile: () => client.get('/api/users/me'),
  updateProfile: (data) => client.put('/api/users/me', data),
  uploadProfilePhoto: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return client.post('/api/users/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getUserProfile: (userId) => client.get(`/api/users/${userId}`)
}
