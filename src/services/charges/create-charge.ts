import { api } from '../api'

export async function createCharge(token: string, description: string, amount: number){
  const charge = await api.post('/charges', {
    description,
    amount
  } ,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return charge
}