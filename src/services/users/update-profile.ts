import { api } from '../api'
import { userInterface } from '@/types/interfaces'

export async function updateProfile(token:string, data: userInterface) {
  const response = await api.put('/profile', {
    name: data.name,
    email: data.email
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response.data
}