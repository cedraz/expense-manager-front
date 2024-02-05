'use client'
import * as React from 'react'

// Material UI
import { Card, CardContent, Grid, Typography } from '@mui/material'

export default function VerifyEmailWarning() {
  
  return (
    <>
      <Grid container direction={'column'} className='home' sx={{height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        <Card variant='outlined' sx={{maxWidth: '400px'}}>
          <CardContent>
            <Typography variant='h4' gutterBottom>
                Verifique seu email
            </Typography>
            <Typography sx={{ mb: 1.5, textAlign: 'justify' }} variant='body1'>
                Para acessar o site é necessário que você verifique sua conta através do email que lhe enviamos.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}