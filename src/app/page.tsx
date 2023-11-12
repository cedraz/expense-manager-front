'use client'
import * as React from 'react'

import { Button, Grid, Typography } from '@mui/material'
// import { useTheme } from '@mui/material/styles'

export default function Home() {
  // const theme = useTheme()

  return (
    <>
      <Grid container wrap="nowrap" direction={'column'} height={'100vh'}>
        <Grid
          item
          xs={4}
          justifyContent={'center'}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography textAlign={'center'} variant="h4">
            Gerenciador de despesas
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid
            container
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            spacing={4}
          >
            <Grid
              item
              xs={4}
              sx={{
                width: '70%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography textAlign={'center'} variant="body2">
                Cadastre-se para poder gerenciar da melhor forma possível suas
                despesas
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" component="a" href="/register">
                Cadastre-se
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="outlined" component="a" href="/login">
                Login
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
