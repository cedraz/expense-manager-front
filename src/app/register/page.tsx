'use client'
import * as React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { api } from '@/services/api'
import { VisibilityOff, Visibility } from '@mui/icons-material'
import handleMessageError from '@/utils/handleMessageError'
import { useRouter } from 'next/navigation'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const theme = useTheme()
  const router = useRouter()

  const red = {color: theme.colors.red}
  const blue = {color: theme.colors.blue }
  const orange = {color: theme.colors.orange }

  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const handleClickShowPassword = (setState: React.Dispatch<React.SetStateAction<boolean>>) => setState((oldState) => !oldState)

  const { register, handleSubmit } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (data.password !== data.confirmPassword) throw new Error('As senhas não coincidem')
      const teste = await api.post('/register', {name: data.name, email: data.email, password: data.password})
      console.log(teste)
      toast.success('Cadastrado com sucesso')
      router.push('/login')
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction={'column'} className='register' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>

        <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

          <Typography variant='h4' sx={{fontWeight: 'bold'}}>FAÇA SEU</Typography>
          <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px'}}>
            <span style={red}>CA</span><span style={blue}>DAS</span><span style={orange}>TRO</span>
          </Typography>

      
          <Grid container alignItems={'center'} justifyContent={'center'} sx={{mb: '20px', gap: '15px', maxWidth: '220px'}}>
            <TextField id="outlined-basic" label="Nome" variant="outlined" sx={{width: '100%'}} {...register('name')} />
            <TextField id="outlined-basic" label="Email" variant="outlined" sx={{width: '100%'}} {...register('email')} />
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

          <Button variant="contained" sx={{borderRadius: '5px', width: '120px'}} type='submit'>Cadastrar</Button>

          <Typography variant='body1' sx={{mt: '10px'}}>Já possue uma conta?</Typography>
          <Button variant='outlined' href='/login' sx={{borderRadius: '5px', width: '120px'}}>Login</Button>
        
        </Grid>
      </Grid>
    </form>
  )
}
