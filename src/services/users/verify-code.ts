import { api } from '../api'

export async function verifyCode({code, email}: {code: string, email: string}) {
  const response = await api.post('/verify-code', {
    code,
    email
  })

  return response.data
}