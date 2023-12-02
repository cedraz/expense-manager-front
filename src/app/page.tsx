'use client'
import * as React from 'react'

// Material UI
import { Box, Button, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export default function Home() {
  const theme = useTheme()

  const black = {color: '#000' }
  const red = {color: theme.colors.red}
  const blue = {color: theme.colors.blue }
  const orange = {color: theme.colors.orange }
  
  return (
    <>
      <Grid container direction={'column'} className='home' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center', position: 'absolute', bottom: 0, mb: '25px'}}>
          <Typography variant='h4' sx={{fontWeight: 'bold'}}>GERENCIADOR</Typography>
          <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px'}}>
            <span style={black}>DE</span> <span style={red}>DES</span><span style={blue}>PE</span><span style={orange}>SAS</span>
          </Typography>

          <Box sx={{backgroundColor: '#b1afff', p: '8px 20px', borderRadius: '22px', mb: '15px'}}>
            <Typography variant='body2'>
              Quer se organizar? Se cadastra!
            </Typography>
          </Box>

          <Button href='/register' variant='contained' sx={{borderRadius: '5px'}}>Cadastre-se</Button>

          <Typography variant='caption' sx={{mt: '10px'}}>Já tem conta?</Typography>
          <Button href='/login' variant='outlined' sx={{borderRadius: '5px'}}>Login</Button>
        </Grid>
      </Grid>
    </>
  )
}