'use client'
import * as React from 'react'

// Material UI
import { Box, Button, Drawer, Grid, IconButton, List, ListItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function Navbar() {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const links = [
    {
      name: 'Página Inicial',
      href: '/'
    },
    {
      name: 'Cartões',
      href: '/credit-cards'
    },
    {
      name: 'Despesas',
      href: '/expenses'
    },
    {
      name: 'Cobranças',
      href: '/charges'
    },
    {
      name: 'Perfil',
      href: '/profile'
    }
  ]

  return (
    <Grid container sx={{justifyContent: 'space-between', position: 'fixed'}}>
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor={'left'} open={open} onClose={toggleDrawer}>
        <Box>
          <List>
            {links.map((link, index) => (
              <ListItem key={index}>
                <Button variant='contained' href={link.href} sx={{width: '100%'}}>{link.name}</Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* <IconButton>
        <AccountCircleIcon />
      </IconButton> */}
    </Grid>
  )
}

 