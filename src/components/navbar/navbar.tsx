'use client'
import * as React from 'react'
import { Box, Button, Divider, Drawer, Grid, IconButton, List, ListItem } from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

export default function Navbar() {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Grid container sx={{justifyContent: 'space-between'}}>
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor={'left'} open={open} onClose={toggleDrawer}>
        <Box>
          <List>
            <ListItem>
              <Button href='/' variant='contained' sx={{width: '100%'}}>Página Inicial</Button>
            </ListItem>
            <ListItem>
              <Button href='/expenses' variant='contained' sx={{width: '100%'}}>Despesas</Button>
            </ListItem>
            <ListItem>
              <Button href='/credit-cards' variant='contained' sx={{width: '100%'}}>Cartões</Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* <IconButton>
        <AccountCircleIcon />
      </IconButton> */}
    </Grid>
  )
}

 