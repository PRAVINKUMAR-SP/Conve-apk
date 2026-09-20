import client from './client'

export const statusApi = {
  createStatus: (data) => client.post('/api/statuses', data),
  getMyStatuses: () => client.get('/api/statuses/mine'),
  getContactStatuses: (contactIds) =>
    client.get('/api/statuses', { params: { contactIds: contactIds.join(',') } }),
  viewStatus: (statusId) => client.post(`/api/statuses/${statusId}/view`),
  getStatusViews: (statusId) => client.get(`/api/statuses/${statusId}/views`)
}
