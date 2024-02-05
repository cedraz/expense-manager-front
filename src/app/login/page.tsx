'use client'
import * as React from 'react'

// React Hook Form
import { useForm, SubmitHandler } from 'react-hook-form'

// Material UI
import { Button, FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Hooks
import { useAuth } from '@/hooks/auth'
import { VisibilityOff, Visibility } from '@mui/icons-material'

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

  const [showPassword, setShowPassword] = React.useState(false)
  const handleClickShowPassword = (setState: React.Dispatch<React.SetStateAction<boolean>>) => setState((oldState) => !oldState)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction={'column'} className='login' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center', pb: '25px'}}>

        <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '230px !important'}}>

          <Typography variant='h4' sx={{fontWeight: 'bold', fontSize: '40px'}}>FAÇA SEU</Typography>
          <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px', fontSize: '40px'}}>
            <span style={blue}>LO</span><span style={red}>GI</span><span style={orange}>N</span>
          </Typography>

      
          <Grid container alignItems={'center'} justifyContent={'flex-start'} sx={{gap: '10px', mb: '20px'}}>
            <TextField sx={{width: '100%'}} id="outlined-basic" label="Email" variant="filled" {...register('email')} />
            <FormControl variant='filled'>
              <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
              <FilledInput
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
              />
            </FormControl>
            <Link href='/password-recovery/forgot-password' sx={{fontSize: '13px', textAlign: 'left'}}>Esqueceu a senha?</Link>
          </Grid>

          

          <Button variant="contained" sx={{borderRadius: '5px', width: '100%'}} type='submit'>Login</Button>

          <Typography variant='body1' sx={{mt: '10px', fontSize: '14px'}}>Não tem uma conta?</Typography>
          <Button variant='outlined' href='/register' sx={{borderRadius: '5px', width: '100%'}}>Cadastre-se</Button>
        
        </Grid>
      </Grid>
    </form>
  )
}
