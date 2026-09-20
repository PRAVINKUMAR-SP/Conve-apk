import client from './client'

export const groupApi = {
  createGroup: (data) => client.post('/api/groups', data),
  getMyGroups: () => client.get('/api/groups'),
  getGroupMembers: (groupId) => client.get(`/api/groups/${groupId}/members`),
  addMember: (groupId, userId) => client.post(`/api/groups/${groupId}/members`, { userId }),
  removeMember: (groupId, userId) => client.delete(`/api/groups/${groupId}/members/${userId}`),
  updateGroup: (groupId, data) => client.put(`/api/groups/${groupId}`, data)
}
