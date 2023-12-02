'use client'
import * as React from 'react'

// React Hook Form
import { useForm, SubmitHandler } from 'react-hook-form'

// Toastify
import { Button, Grid, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Hooks
import { useAuth } from '@/hooks/auth'

type Inputs = {
  email: string
  password: string
}

export default function Login() {
  const theme = useTheme()

  const { signIn } = useAuth()

  const red = {color: theme.colors.red}
  const blue = {color: theme.colors.blue }
  const orange = {color: theme.colors.orange }

  const { register, handleSubmit } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    signIn({email: data.email, password: data.password})
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction={'column'} className='login' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>

        <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

          <Typography variant='h4' sx={{fontWeight: 'bold', fontSize: '40px'}}>FAÇA SEU</Typography>
          <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px', fontSize: '40px'}}>
            <span style={red}>CA</span><span style={blue}>DAS</span><span style={orange}>TRO</span>
          </Typography>

      
          <Grid container alignItems={'center'} justifyContent={'center'} sx={{mb: '20px', gap: '15px'}}>
            <TextField id="outlined-basic" label="Email" variant="filled" {...register('email')} />
            <TextField id="outlined-basic" label="Senha" variant="filled" {...register('password')} />
          </Grid>

          <Button variant="contained" sx={{borderRadius: '5px', width: '120px'}} type='submit'>Login</Button>

          <Typography variant='body1' sx={{mt: '10px'}}>Não tem uma conta?</Typography>
          <Button variant='outlined' href='/register' sx={{borderRadius: '5px', width: '120px'}}>Cadastre-se</Button>
        
        </Grid>
      </Grid>
    </form>
  )
}
