import { api } from '../api'

export async function deleteManyCharges(token: string, chargesIds: string[]){
  const deletedChargesNumber = await api.delete('/charges', {
    data: {
      chargesIds
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return deletedChargesNumber
}