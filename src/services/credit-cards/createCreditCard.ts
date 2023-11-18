import { api } from '../api'

export async function createCreditCards(token: string, cardName: string){
  const creditCard = await api.post('/credit-cards', {
    cardName
  } ,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return creditCard.data
}