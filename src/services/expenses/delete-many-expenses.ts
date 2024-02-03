import { api } from '../api'

export async function deleteManyExpense(token: string, expensesIds: string[]){
  const endpoint = '/expenses'
  console.log(expensesIds)
    
  const deletedManyExpenses = await api.delete(endpoint, {
    data: { expensesIds },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    
  return deletedManyExpenses.data
}