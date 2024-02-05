import { api } from '../api'

export async function updatePassword({token, password}: {token: string, password: string}){
  const response = await api.post('/update-password', {
    password
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return response.data
}