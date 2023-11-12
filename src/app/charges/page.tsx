'use client'
import * as React from 'react'

import { Grid } from '@mui/material'

export default function Teste() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <div>Teste</div>
        </Grid>
      </Grid>
    </>
  )
}
