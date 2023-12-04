import { api } from '../api'

export async function deleteCharge(token: string, chargeId: string){
  const endpoint = `/charges/${chargeId}`
    
  const deletedCharge = await api.delete(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return deletedCharge.data
}