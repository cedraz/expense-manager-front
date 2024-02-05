'use client'
import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Material UI
import { Grid, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

// Services
import { verifyEmail } from '@/services/users/verify-email'
import { toast } from 'react-toastify'
import handleMessageError from '@/utils/handleMessageError'

export default function EmailVerification() {
  const route = useRouter()
  
  const [ loading, setLoading ] = React.useState(false)
  const [ emailVerified, setEmailVerified ] = React.useState(false)
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoading(true)
      const searchParams = useSearchParams()
      const token = searchParams.get('token')
      
      handleVerifyEmail(token)
    }
  }, [])

  const handleVerifyEmail = async (token: string | null) => {
    try {
      if (!token) {
        toast.error('Token inválido.')
        setLoading(false)
        return
      }

      const response = await verifyEmail(token)

      if (!response.verified) {
        toast.error(`
          Erro ao verificar email: ${response.error}
        `)
        setLoading(false)
        return
      }

      toast.success('Email verificado com sucesso!')
      setEmailVerified(true)
      setLoading(false)
      route.push('/login')
    } catch (error) {
      const messageError = handleMessageError(error)
      toast.error(messageError)
    }
  }

  return (
    <>
      <Grid container direction={'column'} className='home' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        {loading && (<CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />)}
        {
          emailVerified ? (
            <Typography>
                    Email verificado
            </Typography>
          ) : (
            <Typography>
                    Email não verificado
            </Typography>
          )
        }
      </Grid>
    </>
  )
}