import { api } from '../api'

export async function getCreditCards(token: string){
  const creditCards = await api.get('/credit-cards', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return creditCards.data
}