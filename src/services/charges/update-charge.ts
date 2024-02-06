import { api } from '../api'

export async function updateCharge({token, description, amount, chargeId}: {token: string, description: string, amount: number, chargeId: string}) {
  const response = await api.put(`/charges/${chargeId}`, {
    description,
    amount
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response.data
}