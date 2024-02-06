import { api } from '../api'

export async function updateExpense({token, description, amount, expenseId}: {token: string, description: string, amount: number, expenseId: string}) {
  const response = await api.put(`/expenses/${expenseId}`, {
    description,
    amount
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return response.data
}