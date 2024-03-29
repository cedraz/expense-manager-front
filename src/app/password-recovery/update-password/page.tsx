'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'

// Material UI
import { Button, Card, CardContent, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'

// Services
import { updatePassword } from '@/services/users/update-password'

// React Hook Form
import { useForm, SubmitHandler } from 'react-hook-form'

import { toast } from 'react-toastify'
import handleMessageError from '@/utils/handleMessageError'
import { VisibilityOff, Visibility } from '@mui/icons-material'

type Inputs = {
  password: string,
  confirmPassword: string
}  

export default function UpdatePassword() {
  const route = useRouter()

  const { register, handleSubmit } = useForm<Inputs>()

  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const passwordToken = localStorage.getItem('passwordToken')

      if (!passwordToken) {
        toast.error('Token inválido')
        return
      }

      console.log(passwordToken)

      if (!data.password || !data.confirmPassword) {
        toast.error('Preencha todos os campos.')
        return
      }

      if (data.password !== data.confirmPassword) {
        toast.error('As senhas não conferem.')
        return
      }

      await updatePassword({password: data.password, token: passwordToken})

      localStorage.removeItem('passwordToken')
      toast.success('Senha atualizada com sucesso.')

      route.push('/login')
    } catch (error) {
      const messageError = handleMessageError(error)
      toast.error(messageError)
      console.log(error)
    }
  }

  const handleClickShowPassword = (setState: React.Dispatch<React.SetStateAction<boolean>>) => setState((oldState) => !oldState)

  return (
    <>
      <Grid container direction={'column'} className='home' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        <Card variant='outlined' sx={{width: '350px'}}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant='h5' sx={{mb: '15px', textAlign: 'center'}} gutterBottom>
                Alterar senha
              </Typography>

              <Typography variant='body1' sx={{mb: '15px', textAlign: 'center'}}>
                Insira sua nova senha no campo abaixo
              </Typography>

              <Grid container alignItems={'center'} justifyContent={'center'} sx={{mb: '20px', gap: '10px'}}>
                <FormControl variant="outlined" >
                  <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword(setShowPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <FormControl variant="outlined" >
                  <InputLabel htmlFor="outlined-adornment-password">Confirmar senha</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword(setShowConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Grid>

              <Button type='submit' variant='contained' sx={{width: '100%', mb: '15px'}}>Alterar senha</Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}