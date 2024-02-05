'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'

// Zod
import { z } from 'zod'
import { ZodError } from 'zod'

// Material UI
import { Button, Card, CardContent, Grid, Link, TextField, Typography } from '@mui/material'

// Services
import { forgotPassword } from '@/services/users/forgot-password'

// React Hook Form
import { useForm, SubmitHandler } from 'react-hook-form'
import handleMessageError from '@/utils/handleMessageError'

// React Toastify
import { toast } from 'react-toastify'

type Inputs = {
    email: string
}

export default function ForgotPassword() {
  const route = useRouter()

  const forgotPasswordSchema = z.object({
    email: z.string().email()
  })

  const { register, handleSubmit } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const {email} = forgotPasswordSchema.parse(data) 
        
      await forgotPassword(email)

      toast.success('Código enviado para o email.')
      route.push(`/password-recovery/verify-code?email=${email}`)
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error('E-mail inválido.')
        return
      }

      const messageError = handleMessageError(error)
      toast.error(messageError)
    }
  }
  
  return (
    <>
      <Grid container direction={'column'} className='home' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        <Card variant='outlined' sx={{width: '350px'}}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant='h5' sx={{mb: '15px', textAlign: 'center'}} gutterBottom>
                Redefinir Senha
              </Typography>
              <Typography sx={{mb: '25px', textAlign: 'center'}} >
                Informe o e-mail para o qual deseja redefinir a sua senha.
              </Typography>
              <TextField id="filled-basic" label="E-mail" variant="filled" sx={{width: '100%', mb: '20px'}} {...register('email')}/>
              <Button type='submit' variant="contained" sx={{borderRadius: '5px', width: '100%', mt: '10px', mb: '10px'}}>Redefinir senha</Button>
              <Link href="/login" variant="body2" sx={{display: 'block', textAlign: 'center', mt: '10px'}}>Voltar ao login</Link>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}