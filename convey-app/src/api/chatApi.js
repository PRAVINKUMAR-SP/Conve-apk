import client from './client'

export const chatApi = {
  getMyChats: () => client.get('/api/chats'),
  getMessages: (conversationId, page = 0, size = 50) =>
    client.get(`/api/chats/${conversationId}/messages`, { params: { page, size } }),
  sendMessage: (data) => client.post('/api/chats/send', data),
  markDelivered: (messageId) => client.post(`/api/chats/messages/${messageId}/delivered`),
  markRead: (messageId) => client.post(`/api/chats/messages/${messageId}/read`)
}
