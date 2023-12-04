'use client'
import * as React from 'react'

// Material UI
import { Typography, IconButton, Divider, Box, List, ListItem, Checkbox, Modal, Grid, Button, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'

// Utils
import handleMessageError from '@/utils/handleMessageError'
import { centsToString } from '@/utils/centsToString'
import { dateFormatter } from '@/utils/dateFormatter'

// Services
import { getCharges } from '@/services/charges/get-charges'
import { createCharge } from '@/services/charges/create-charge'
import { stringToCents } from '@/utils/stringToCents'
import { toast } from 'react-toastify'
import { deleteCharge } from '@/services/charges/delete-charge'
interface chargeInterface {
  id: string;
  amount: number;
  description: string;
  date: string;
  user_id: string;
}

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

  const [ token, setToken ] = React.useState<string>('')
  const [open, setOpen] = React.useState(false)
  const [charges, setCharges] = React.useState<chargeInterface[]>([])
  const [ newChargeDescription, setNewChargeDescription ] = React.useState<string>('')
  const [ newChargeAmount, setNewChargeAmount ] = React.useState<string>('')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) return
      setToken(storedToken)
      
      handleGetCharges(storedToken)
    }

  }, [setToken])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleGetCharges = async (token: string) => {
    try {
      const response = await getCharges(token)
      console.log(response.data)
      setCharges(response.data)
    } catch (error) {
      handleMessageError(error)
    }
  }

  const handleCreateCharge = async () => {
    try {
      const amount = stringToCents(newChargeAmount)
      const response = await createCharge(token, newChargeDescription, amount)
      console.log(response.data)
      setCharges([...charges, response.data])
      handleClose()
      toast.success('Cobrança criada com sucesso!')
      setNewChargeDescription('')
      setNewChargeAmount('')
    } catch (error) {
      handleMessageError(error)
    }
  }

  const handleDeleteCharge = async (chargeId: string) => {
    try {
      await deleteCharge(token, chargeId)

      setCharges((prevCharges) => {
        return prevCharges.filter((charge) => charge.id !== chargeId)
      })

      toast.success('Cobrança deletada com sucesso!')
    } catch (error) {
      handleMessageError(error)
    }
  }

  return (
    <>
      <Grid sx={{minHeight: '100vh', height: '100%'}} className='fundo-padrao'>
        
        <Grid container direction={'column'} >

          <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center'}}>

            <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px', fontSize: '40px'}}>
              <span style={blue}>CO</span><span style={red}>BRAN</span><span style={orange}>ÇAS</span>
            </Typography>

            <List sx={{width: '100%'}}>
              <ListItem sx={{justifyContent: 'space-between'}}>
                {/* <Grid container direction={'row'} alignItems={'center'}>
                  <Checkbox />
                  <Typography variant='body2' sx={{ml: '5px'}}>Selecionar todos</Typography>
                </Grid>
                <IconButton>
                  <DeleteForeverIcon/>
                </IconButton> */}
              </ListItem>
              <Divider sx={{mb: '10px'}}/>

              <ListItem sx={{justifyContent: 'center'}}>
                <Button variant='contained' sx={{mb: '10px'}} onClick={handleOpen}>
                  <AddIcon sx={{mr: '10px'}} /> Adicionar cobrança
                </Button>
                <Modal 
                  open={open} onClose={handleClose}>
                  <Box sx={style} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <TextField
                      id="outlined-basic"
                      label="Descrição"
                      variant="outlined"
                      sx={{mb: '15px', width: '100%'}}
                      value={newChargeDescription}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewChargeDescription(e.target.value)}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Valor"
                      variant="outlined"
                      sx={{mb: '15px', mt: '10px', width: '100%'}}
                      value={newChargeAmount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewChargeAmount(e.target.value)}
                    />
                    <Button variant='contained' sx={{borderRadius: '5px', mt: '10px', mb: '10px'}} onClick={handleCreateCharge}>
                      Adicionar despesa
                    </Button>
                  </Box>
                </Modal>
              </ListItem>

              {charges.map((charge: chargeInterface) => (
                <ListItem sx={{mt: '10px', mb: '20px'}} key={charge.id}>
                  <Grid container sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                    <Grid item container direction={'row'} xs={8} sx={{pr: '10px', overflow: 'hidden'}}>
                      {/* <Checkbox/> */}
                      <Box sx={{ml: '5px'}}>
                        <Typography variant='body1' sx={{fontSize: '15px'}}>{charge.description}</Typography>
                        <Typography variant='caption' sx={{fontSize: '12px'}}>{dateFormatter(charge.date)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item container direction={'row'} xs={4} justifyContent={'space-between'} alignItems={'center'}>
                      <Typography variant='body2' sx={{fontSize: '14px', pr: '2px'}}>{centsToString(charge.amount)}</Typography>
                      <IconButton onClick={() => handleDeleteCharge(charge.id)}>
                        <DeleteForeverIcon sx={{color: 'red'}}/>
                      </IconButton>
                  
                    </Grid>
                    {/* <Modal 
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
                </Modal> */}
                  </Grid>
                </ListItem>
              ))}
            </List>
            
            

          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
