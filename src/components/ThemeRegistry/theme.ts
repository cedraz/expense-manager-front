import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      red: string;
      blue: string;
      orange: string;
    }
  }
  interface ThemeOptions {
    colors?: {
      red?: string;
      blue?: string;
      orange?: string;
    }
  }
  interface BreakpointOverrides {
    xs: true;
    mm: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5552FF',
    }
  },
  colors: {
    red: '#FF5252',
    blue: '#5552FF',
    orange: '#FF9052'
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {

        },
      },
    }
  },
})

export default theme