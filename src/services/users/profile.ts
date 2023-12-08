import { api } from '../api'

export async function profile(token: string){
  const user = await api.get('/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return user.data
}