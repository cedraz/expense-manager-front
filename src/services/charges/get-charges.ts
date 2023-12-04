import { api } from '../api'

export async function getCharges(token: string){
  const charges = await api.get('/charges', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return charges
}