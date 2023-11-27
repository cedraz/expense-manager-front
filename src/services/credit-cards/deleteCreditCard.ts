import { api } from '../api'

export async function deleteCreditCard(token: string, creditCardId: string){
  const endpoint = `/credit-cards/${creditCardId}`

  const deletedCreditCard = await api.delete(endpoint,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return deletedCreditCard.data
}