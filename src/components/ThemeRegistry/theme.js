import { Roboto } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000',
      box: '#121212',
      paper: '#1f1f1f',
    },
    primary: {
      main: '#A03E3E',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
})

export default theme
