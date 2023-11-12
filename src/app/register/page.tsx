'use client'
import * as React from 'react'
import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'

import {
  Button,
  Grid,
  Typography,
  TextField,
  Snackbar,
  IconButton,
  Alert,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type Inputs = {
  nome: string
}

async function registerUser(data: Inputs) {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto')
  console.log(data)
  return response
}

export default function Register() {
  const [open, setOpen] = React.useState(false)

  const handleClick = async (data: Inputs) => {
    const response = await registerUser(data)
    if (response.status === 200) {
      setOpen(true)
      console.log(response)
    }
  }

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    handleClick(data)
  }

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const action: React.ReactNode = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container wrap="nowrap" direction={'column'} height={'100vh'}>
        <Grid
          item
          xs={3}
          justifyContent={'center'}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography textAlign={'center'} variant="h4">
            Cadastre-se
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Grid
            container
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            spacing={4}
          >
            <Grid item xs={4}>
              <TextField
                required
                id="outlined-required"
                label="Nome Completo"
                variant="filled"
                {...register('nome')}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="outlined-required"
                label="Email"
                variant="filled"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="outlined-required"
                label="Senha"
                variant="filled"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="outlined-required"
                label="Confirmar Senha"
                variant="filled"
              />
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" type="submit">
                Cadastrar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          message="Note archived"
          action={action}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success">Cadastro feito com sucesso</Alert>
        </Snackbar>
      </Grid>
    </form>
  )
}
