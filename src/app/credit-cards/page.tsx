'use client'
import * as React from 'react'

import { Typography, Grid, IconButton, Box, Modal, Button, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Icons
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import WalletIcon from '@mui/icons-material/Wallet'
import CreateIcon from '@mui/icons-material/Create'
import { api } from '@/services/api'
import { toast } from 'react-toastify'
import handleMessageError from '@/utils/handleMessageError'
import { useRouter, usePathname } from 'next/navigation'

interface creditCardInterface {
  id: string;
  card_name: string;
}

const getCreditCards = async (token: string, setCreditCards: React.Dispatch<React.SetStateAction<never[]>>) => {
  try {
    const creditCards = await api.get('/credit-cards', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    setCreditCards(creditCards.data)
  } catch (error: any) {
    toast.error(handleMessageError(error))
  }
}

const updateCreditCard = async (token:string, cardId: string, cardName: string) => {
  try {
    await api.patch(`/credit-cards/${cardId}`, {
      cardName: cardName
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    toast.success('Cartão atualizado com sucesso!')
  } catch (error: any) {
    console.log(error)
    toast.error(handleMessageError(error))
  }
}

export default function CreditCards() {
  const theme = useTheme()

  const [ token, setToken ] = React.useState<string>('')
  const [ creditCards, setCreditCards ] = React.useState([])
  const [ selectedCardId, setSelectedCardId ] = React.useState<string | null>(null) 
  const [ newCardName, setNewCardName ] = React.useState<string>('')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) return
      setToken(storedToken)
      getCreditCards(storedToken, setCreditCards)
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

  const handleOpen = (cardId: string) => {
    setSelectedCardId(cardId)
  }

  const handleClose = () => {
    setSelectedCardId(null)
  }

  const handleSave = async (selectedCardId: string) => {
    // Faça a requisição PUT aqui usando o valor de newCardName
    // e atualize o estado ou realize outras operações necessárias
    console.log(token, selectedCardId, newCardName)
    await updateCreditCard(token, selectedCardId, newCardName)
    // Limpe o estado e feche o modal
    setNewCardName('')
    handleClose()
  }

  return (
    <>
      <Grid sx={{minHeight: '100vh', height: '100%'}} className='fundo-padrao'>
        <Grid container sx={{justifyContent: 'space-between'}}>
          <IconButton>
            <MenuIcon />
          </IconButton>
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </Grid>
        <Grid container direction={'column'} >

          <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center'}}>

            <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px'}}>
              <span style={blue}>CAD</span><span style={red}>AST</span><span style={orange}>RAR</span>
            </Typography>

            <Box className='card' sx={{width: '300px', height: '200px', borderRadius: '15px', position: 'relative'}}>
              <Typography variant='body1' sx={{color: '#fff', position: 'absolute', bottom: 15, left: 15}}>Nome do cartão</Typography>
            </Box>

            <Button variant='contained' sx={{borderRadius: '5px', mt: '10px', mb: '10px'}}>
                Adicionar cartão
            </Button>


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
        </Grid>
      </Grid>
    </>
  )
}
