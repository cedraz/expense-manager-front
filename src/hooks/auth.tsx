'use client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-toastify'
  
import { api } from '@/services/api'
  
import { useRouter, usePathname } from 'next/navigation'
  
  interface ISignCredentials {
    email: string;
    password: string;
  }
  
  type UserData = {
    token: string;
  };
  
  interface IAuthContextData {
    signIn(credentials: ISignCredentials): Promise<void>;
    signOut(): void;
    user: UserData | undefined;
  }
  
const AuthContext = createContext<IAuthContextData>({} as IAuthContextData)
  
export default function AuthProvider({
  children,
}: {
    children: React.ReactNode;
  }) {
  const [user, setUser] = useState<UserData | undefined>()
  const pathname = usePathname()

  const route = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && (
      pathname !== '/login' 
      && pathname !== '/register' 
      && pathname !== '/' 
      && pathname !== '/password-recovery/forgot-password' 
      && pathname !== '/password-recovery/verify-code'
      && pathname !== '/password-recovery/update-password'
      && pathname !== '/verify-email'
      && pathname !== '/verify-email-warning')) {
      route.push('/login')
  
      return
    }

  }, [route, user])
  
  const signIn = useCallback(
    async ({ email, password }: ISignCredentials) => {
      if (!email || !password) {
        toast.error('Preencha todos os campos.')
        return
      }

      const toastId = toast.loading('Fazendo login...', {
        theme: 'colored',
      })
  
      try {
        const response = await api.post('/login', {
          email,
          password,
        })
        const { token } = response.data
        setUser({ token })
        localStorage.setItem('token', token)
  
        toast.done(toastId)
        route.push('/credit-cards')
      } catch (error) {
        toast.update(toastId, {
          render: 'Usuário ou senha incorretos.',
          type: 'error',
          autoClose: 5000,
          isLoading: false,
        })
      }
    },
    [route],
  )
  
  const signOut = useCallback(() => {
    setUser(undefined)
  }, [])
  
  return (
    <AuthContext.Provider value={{ signOut, signIn, user }}>
      {children}
    </AuthContext.Provider>
  )
}
  
function useAuth(): IAuthContextData {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
  
export { AuthProvider, useAuth }