'use client'
import * as React from 'react'

import { Typography, Grid, IconButton, Box, Modal, Button, TextField} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Icons
import WalletIcon from '@mui/icons-material/Wallet'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'

import { toast } from 'react-toastify'
import handleMessageError from '@/utils/handleMessageError'
import { useRouter } from 'next/navigation'

import { getCreditCards } from '@/services/credit-cards/getCreditCards'
import { updateCreditCard } from '@/services/credit-cards/updateCreditCard'
import { createCreditCards } from '@/services/credit-cards/createCreditCard'

import Navbar from '@/components/navbar/navbar'
import { AddCircleOutline } from '@mui/icons-material'
interface creditCardInterface {
  id: string;
  card_name: string;
}

export default function CreditCards() {
  const theme = useTheme()
  const router = useRouter()

  const [ token, setToken ] = React.useState<string>('')
  const [ open, setOpen ] = React.useState(false)
  const [ creditCards, setCreditCards ] = React.useState([])
  const [ selectedCardId, setSelectedCardId ] = React.useState<string | null>(null) 
  const [ newCardName, setNewCardName ] = React.useState<string>('')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) return
      setToken(storedToken)
      
      handleGetCreditCards(storedToken)
    }

  }, [setCreditCards, setToken])

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
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
  }

  const handleGetCreditCards = async (token: string) => {
    try {
      const response = await getCreditCards(token)
      setCreditCards(response)
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  const handleCreateCreditCard = async () => {
    try {
      await createCreditCards(token, newCardName)
    } catch (error) {
      toast.error(handleMessageError(error))
    }

    setNewCardName('')
    handleCloseCreateCreditCard()
    window.location.reload()
  }

  const handleOpenCreateCreditCard = () => setOpen(true)

  const handleCloseCreateCreditCard = () => setOpen(false)

  const handleOpen = (cardId: string) => {
    setSelectedCardId(cardId)
  }

  const handleClose = () => {
    setSelectedCardId(null)
  }

  const handleSave = async (selectedCardId: string) => {
    try {
      await updateCreditCard(token, selectedCardId, newCardName)
    } catch (error) {
      toast.error(handleMessageError(error))
    }

    setNewCardName('')
    handleClose()
    window.location.reload()
  }

  return (
    <>
      <Grid sx={{height: '100%', minHeight: '100vh'}} className='fundo-padrao'>
        <Navbar />

        <Grid container direction={'column'} sx={{display: 'flex', alignItems: 'center'}}>

          <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center'}}>

            <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px'}}>
              <span style={blue}>CAD</span><span style={red}>AST</span><span style={orange}>RAR</span>
            </Typography>

            <Box className='card' sx={{width: '300px', height: '200px', borderRadius: '15px', position: 'relative'}}>
              <Typography variant='body1' sx={{color: '#fff', position: 'absolute', bottom: 15, left: 15}}>Nome do cartão</Typography>
            </Box>

            <Button variant='outlined' sx={{borderRadius: '5px', mt: '10px', mb: '10px'}} onClick={handleOpenCreateCreditCard}>
              <AddIcon/> Adicionar cartão
            </Button>

            <Modal open={open} onClose={handleCloseCreateCreditCard}>
              <Box sx={style}>
                <TextField
                  id="outlined-basic"
                  label="Nome do cartão"
                  variant="outlined"
                  sx={{mb: '15px'}}
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                />
                <Button variant='contained' sx={{borderRadius: '5px', mt: '10px', mb: '10px'}} onClick={() => handleCreateCreditCard()}>
                  Salvar cartão
                </Button>
              </Box>
            </Modal>

            {creditCards.map((creditCard: creditCardInterface) => (
              <Grid key={creditCard.id} container direction={'row'} sx={{width: '300px', borderRadius: '5px', p: '10px', mb: '15px', justifyContent: 'space-between', border: '1px solid'}}>
                <Grid container item xs={10.5} direction={'row'} sx={{alignItems: 'center'}}>
                  <WalletIcon sx={{mr: '15px'}}/>
                  <Typography variant='body1'>{creditCard.card_name}</Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <IconButton onClick={() => handleOpen(creditCard.id)}>
                    <CreateIcon />
                  </IconButton>
                </Grid>
                <Modal 
                  open={selectedCardId === creditCard.id}
                  onClose={handleClose}
                >
                  <Box sx={style}>
                    <TextField
                      id="outlined-basic"
                      label="Nome do cartão"
                      variant="outlined"
                      sx={{mb: '15px'}}
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                    />
                    <Button variant='contained' sx={{borderRadius: '5px', mt: '10px', mb: '10px'}} onClick={() => handleSave(creditCard.id)}>
                        Salvar
                    </Button>
                  </Box>
                </Modal>
              </Grid>
            ))}

            

          </Grid>

          <Button href='/expenses' variant='contained' disabled={creditCards.length == 0}>Cadastrar despesas</Button>
        </Grid>
      </Grid>
    </>
  )
}
