'use client'
import * as React from 'react'

// Material UI
import { Typography, Grid, TextField, Stack, Button, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import Fingerprint from '@mui/icons-material/Fingerprint'
import CircularProgress from '@mui/material/CircularProgress'

// Utils
import handleMessageError from '@/utils/handleMessageError'

// Services
import { profile } from '@/services/users/profile'
import { updateProfile } from '@/services/users/update-profile'

// React Toastify
import { toast } from 'react-toastify'

// Interfaces
import { userInterface } from '@/types/interfaces'

export default function Expenses() {
  const theme = useTheme()

  const red = {color: theme.colors.red}
  const blue = {color: theme.colors.blue }
  const orange = {color: theme.colors.orange }

  const [ token, setToken ] = React.useState<string>('')
  const [ user, setUser ] = React.useState<userInterface>({name: '', email: ''})
  const [ loading, setLoading ] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')

      if (!storedToken) {
        toast.error('Erro ao carregar os dados do usuário.')
        return
      }

      setLoading(true)

      setToken(storedToken)
      handleProfile(storedToken)
    }
  }, [])

  const handleSubmit = async () => {
    try {
      if (user.name === '') {
        toast.error('O campo nome é obrigatório.')
        return
      }

      if (user.email === '') {
        toast.error('O campo email é obrigatório.')
        return
      }

      await updateProfile(token, user)
      toast.success('Perfil atualizado com sucesso.')
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  const handleProfile = async (token: string) => {
    try {
      const response = await profile(token)
      const user = {
        name: response.name,
        email: response.email,
        password: ''
      }

      setLoading(false)
      setUser(user)
    } catch (error) {
      console.error(error)
      handleMessageError(error)
    }
  }

  return (
    <>
      <Grid container sx={{minHeight: '100vh', height: '100%'}} className='fundo-padrao'>
        
        <Grid container direction={'column'} alignItems={'center'}>
          <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px', mt: '30px', fontSize: '40px'}}>
            <span style={blue}>PE</span><span style={red}>RF</span><span style={orange}>IL</span>
          </Typography>

          <AccountBoxIcon sx={{fontSize: '100px'}}></AccountBoxIcon>

          <Stack spacing={2} sx={{
            width: '100%', 
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '300px',
            mt: '30px'
          }}>
            <Box sx={{position: 'relative'}}>
              <TextField 
                label="Nome"
                value={user.name}
                sx={{width: '100%'}}
                onChange={(e) => setUser({...user, name: e.target.value})}
              ></TextField>
              {loading && <CircularProgress size={24}
                sx={{
                  position: 'absolute',
                  zIndex: 10,
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}/>}
            </Box>

            <Box sx={{position: 'relative'}}>
              <TextField
                label="Email"
                value={user.email}
                sx={{width: '100%'}}
                onChange={(e) => setUser({...user, email: e.target.value})}
              ></TextField>
              {loading && <CircularProgress size={24}
                sx={{
                  position: 'absolute',
                  zIndex: 10,
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}/>}
            </Box>

            <Button href='/forgot-password' variant='outlined' endIcon={<Fingerprint/>}>
              Alterar senha
            </Button>

            <Button variant='contained' onClick={handleSubmit}>
                  Atualizar perfil
            </Button>
          </Stack>
          
        </Grid>
      </Grid>
    </>
  )
}
