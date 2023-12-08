import { api } from '../api'

export async function deleteExpense(token: string, expenseId: string){
  const endpoint = `/expenses/${expenseId}`
    
  const deletedExpense = await api.delete(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return deletedExpense.data
}