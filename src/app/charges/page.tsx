'use client'
import * as React from 'react'

// Material UI
import { Typography, IconButton, Divider, Box, List, ListItem, Accordion, AccordionSummary, AccordionDetails, Checkbox, Modal, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import WalletIcon from '@mui/icons-material/Wallet'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CreateIcon from '@mui/icons-material/Create'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Navbar from '@/components/navbar/navbar'

export default function Expenses() {
  const theme = useTheme()

  const red = {color: theme.colors.red}
  const blue = {color: theme.colors.blue }
  const orange = {color: theme.colors.orange }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Grid sx={{minHeight: '100vh', height: '100%'}} className='fundo-padrao'>
        <Navbar />
        
        <Grid container direction={'column'} >

          <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center'}}>

            <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px'}}>
              <span style={blue}>DES</span><span style={red}>PE</span><span style={orange}>SAS</span>
            </Typography>

            <List sx={{width: '100%'}}>
              <ListItem sx={{justifyContent: 'space-between'}}>
                <Grid container direction={'row'} alignItems={'center'}>
                  <Checkbox />
                  <Typography variant='body2' sx={{ml: '15px'}}>Selecionar todos</Typography>
                </Grid>
                <IconButton>
                  <DeleteForeverIcon/>
                </IconButton>
              </ListItem>
              <Divider sx={{mb: '10px'}}/>
              <ListItem sx={{width: '100%'}}>
                <Accordion sx={{mb: '25px', width: '100%'}}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{backgroundColor: '#B1AFFF'}}>
                    <Grid container direction={'row'} alignItems={'center'}>
                      <WalletIcon/>
                      <Typography variant='body2' sx={{ml: '15px'}}>Meu cartão nubank</Typography>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails sx={{pb: '0'}}>
                    <List>
                      <ListItem sx={{p: '0', mt: '10px', mb: '20px'}}>
                        <Grid container sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                          <Checkbox sx={{p: '0'}}/>
                          <Grid sx={{pr: '10px', overflow: 'hidden'}}>
                            <Typography variant='body1' sx={{fontSize: '13px'}}>Uber para casa sssssssaa</Typography>
                            <Typography variant='caption' sx={{fontSize: '10px'}}>Qua, 01/12/2023</Typography>
                          </Grid>
                          <Typography variant='body2' sx={{fontSize: '13px', pr: '2px'}}>R$ 15,00</Typography>
                          <IconButton onClick={handleOpen} sx={{p: '0 !important'}}>
                            <CreateIcon sx={{fontSize: '20px'}}/>
                          </IconButton>
                          <Modal 
                            open={open}
                            onClose={handleClose}
                          >
                            <Box sx={style}>
                              <Typography id="modal-modal-title" variant="h6" component="h2">
                            Text in a modal
                              </Typography>
                              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                              </Typography>
                            </Box>
                          </Modal>
                        </Grid>
                      </ListItem>
                  
                  
                    </List>
                  </AccordionDetails>
                </Accordion>
              </ListItem>
            </List>
            
            

          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
