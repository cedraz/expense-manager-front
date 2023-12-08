import { api } from '../api'

export async function updateCreditCard(token:string, cardId: string, cardName: string) {
  const response = await api.put(`/credit-cards/${cardId}`, {
    cardName: cardName
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response.data
}