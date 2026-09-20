import client from './client'

export const contactApi = {
  checkContacts: (phoneNumbers) =>
    client.post('/api/contacts/check', { phoneNumbers })
}
