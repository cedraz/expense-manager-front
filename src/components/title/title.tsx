'use client'
import * as React from 'react'

import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export default function Title() {
  const theme = useTheme()

  const black = {color: '#000' }
  const red = {color: theme.colors.red}
  const blue = {color: theme.colors.blue }
  const orange = {color: theme.colors.orange }

  const titleExpenses = () => {
    return (
      <>
        <span style={red}>DES</span><span style={blue}>PE</span><span style={orange}>SAS</span>
      </>
    )
  }

  const titleCharges = () => {
    return (
      <>
        <span style={red}>CO</span><span style={blue}>BRAN</span><span style={orange}>ÇAS</span>
      </>
    )
  }

  const titleLogin = () => {
    return (
      <>
        <span style={red}>LO</span><span style={blue}>GI</span><span style={orange}>N</span>
      </>
    )
  }

  const titleRegister = () => {
    return (
      <>
        <span style={red}>CA</span><span style={blue}>DAS</span><span style={orange}>TRO</span>
      </>
    )
  }

  const titleCreditCards = () => {
    return (
      <>
        <span style={red}>CA</span><span style={blue}>DAS</span><span style={orange}>TRAR</span>
      </>
    )
  }

  const titleExtract = () => {
    return (
      <>
        <span style={red}>EX</span><span style={blue}>TRA</span><span style={orange}>TO</span>
      </>
    )
  }

  return (
    <>
      {titleCharges()}
    </>
  )
}