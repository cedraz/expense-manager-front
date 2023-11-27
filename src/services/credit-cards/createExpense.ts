import { api } from '../api'

export async function createExpense(token: string, description: string, amount: number, cardId: string){
  const endpoint = `/expenses/${cardId}`
  
  const creditCard = await api.post(endpoint, {
    description,
    amount
  } ,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return creditCard.data
}