'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'

// Material UI
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'

// Services
import { verifyCode } from '@/services/users/verify-code'

// React Hook Form
import { useForm, SubmitHandler } from 'react-hook-form'

import { toast } from 'react-toastify'
import handleMessageError from '@/utils/handleMessageError'

type Inputs = {
  code: string
}  

export default function VerifyCode() {
  const route = useRouter()
  
  const { register, handleSubmit } = useForm<Inputs>()
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const searchParams = new URLSearchParams(window.location.search)
    const email = searchParams.get('email')
    const code = data.code

    if (!email || !code) {
      toast.error('Error ao validar o código.')
      return
    }

    try {
      const response = await verifyCode({email, code})

      localStorage.setItem('passwordToken', response.token)

      toast.success('Código validado com sucesso!')

      route.push('/password-recovery/update-password')
    } catch (error) {
      const messageError = handleMessageError(error)
      toast.error(messageError)
      console.error(error)
    }
  }

  return (
    <>
      <Grid container direction={'column'} className='home' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        <Card variant='outlined' sx={{width: '350px'}}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant='h5' sx={{mb: '15px', textAlign: 'center'}} gutterBottom>
                Verificação de código
              </Typography>

              <Typography variant='body1' sx={{mb: '15px', textAlign: 'center'}}>
              Insira o código que foi enviado para o seu email no campo abaixo 
              </Typography>

              <Typography variant='subtitle2' sx={{mb: '15px', textAlign: 'center'}}>
              (o código possui um tempo de expiração de 5 minutos)
              </Typography>
            
              <TextField sx={{width: '100%', mb: '15px'}} id="outlined-basic" label="Código" variant="outlined" {...register('code')} />

              <Button type='submit' variant='contained' sx={{width: '100%', mb: '15px'}}>Confirmar código</Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}