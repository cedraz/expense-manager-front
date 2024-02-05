import { api } from '../api'

export async function verifyEmail(token:string) {
  const response = await api.get('/verify-email', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response.data
}