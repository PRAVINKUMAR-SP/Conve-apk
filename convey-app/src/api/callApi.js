import client from './client'

export const callApi = {
  getCallHistory: () => client.get('/api/calls'),
  initiateCall: (receiverId, type = 'VOICE') =>
    client.post('/api/calls', { receiverId, type }),
  updateCallStatus: (callId, status) =>
    client.put(`/api/calls/${callId}/status`, { status })
}
