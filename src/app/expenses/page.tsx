'use client'
import * as React from 'react'

import { Typography, Grid, IconButton, Divider, Box, List, ListItem, Accordion, AccordionSummary, AccordionDetails, Checkbox, Modal, Button, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Icons
import WalletIcon from '@mui/icons-material/Wallet'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CreateIcon from '@mui/icons-material/Create'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'

import Navbar from '@/components/navbar/navbar'
import { toast } from 'react-toastify'
import handleMessageError from '@/utils/handleMessageError'
import { getCreditCards } from '@/services/credit-cards/getCreditCards'
import { format } from 'date-fns'
import { createExpense } from '@/services/credit-cards/createExpense'
import { stringToCents } from '@/utils/stringToCents'
import { centsToString } from '@/utils/centsToString'
import { deleteExpense } from '@/services/credit-cards/delete-expense'

interface expenseInterface {
  id: string;
  amount: number;
  description: string;
  date: string;
  credit_card_id: string;
}
interface creditCardInterface {
  id: string;
  card_name: string;
  Expenses: expenseInterface[];
}

interface creditCardWithStatementInterface {
  id: string;
  card_name: string;
  statement: number;
  Expenses: expenseInterface[];
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

  const [open, setOpen] = React.useState(false)
  const [token, setToken] = React.useState<string>('')
  const [creditCards, setCreditCards] = React.useState<creditCardWithStatementInterface[]>([])
  const [statement, setStatement] = React.useState(0)

  const [ expenseDescription, setExpenseDescription ] = React.useState<string>('')
  const [ expenseAmount, setExpenseAmount ] = React.useState<string>('')
  const [ selectedCardId, setSelectedCardId ] = React.useState<string | null>(null) 

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) return
      setToken(storedToken)
      
      handleGetExpenses(storedToken)
    }

  }, [setToken])

  const dateFormatter = (date: string) => {
    const newDate = new Date(date)

    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short'
    }).format(newDate)
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOpenCreateExpense = (cardId: string) => {
    setSelectedCardId(cardId)
  }

  const handleCloseCreateExpense = () => {
    setSelectedCardId(null)
  }

  const handleCreateExpense = async (creditCardId: string) => {
    try {
      const amount = stringToCents(expenseAmount)
      const newExpense = await createExpense(token, expenseDescription, amount, creditCardId)
  
      setCreditCards((prevCreditCards) => {
        // Mapeia sobre os cartões existentes
        return prevCreditCards.map((creditCard) => {
          if (creditCard.id === creditCardId) {
            // Se for o cartão correto, atualiza o statement e adiciona a nova despesa
            return {
              ...creditCard,
              Expenses: [...creditCard.Expenses, newExpense],
              statement: (creditCard.statement || 0) + amount,
            }
          }
          // Se não for o cartão correto, mantém inalterado
          return creditCard
        })
      })
  
      setSelectedCardId(null)
      setExpenseDescription('')
      setExpenseAmount('')
      toast.success('Despesa criada com sucesso!')
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(token, expenseId)
  
      setCreditCards((prevCreditCards) => {
        return prevCreditCards.map((creditCard) => {
          if (creditCard.Expenses.some((expense) => expense.id === expenseId)) {
            const newExpenses = creditCard.Expenses.filter((expense) => expense.id !== expenseId)
            const newStatement = newExpenses.reduce((acc, expense) => acc + expense.amount, 0)
  
            return {
              ...creditCard,
              Expenses: newExpenses,
              statement: newStatement,
            }
          }
  
          return creditCard
        })
      })
  
      toast.success('Despesa deletada com sucesso!')
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }
  
  const handleGetExpenses = async (token: string) => {
    try {
      const creditCards = await getCreditCards(token)

      const creditCardWithStatement = creditCards.map((creditCard: creditCardInterface) => {
        const creditCardStatement = creditCard.Expenses.reduce((accExpenses: number, expense: expenseInterface) => {
          return accExpenses + expense.amount
        }, 0)

        return {
          ...creditCard,
          statement: creditCardStatement
        }
      })

      const totalStatement = creditCardWithStatement.reduce((acc: number, creditCard: creditCardWithStatementInterface) => {
        return acc + creditCard.statement
      }, 0)

      setStatement(totalStatement)
      setCreditCards(creditCardWithStatement)
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  return (
    <>
      <Grid sx={{minHeight: '100vh', height: '100%'}} className='fundo-padrao'>
        <Grid container direction={'column'} >

          <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center'}}>

            <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px'}}>
              <span style={blue}>DES</span><span style={red}>PE</span><span style={orange}>SAS</span>
            </Typography>

            <List sx={{width: '100%'}}>
              {/* <ListItem sx={{justifyContent: 'space-between'}}>
                <Grid container direction={'row'} alignItems={'center'}>
                  <Checkbox />
                  <Typography variant='body2' sx={{ml: '15px'}}>Selecionar todos</Typography>
                </Grid>
                <IconButton>
                  <DeleteForeverIcon/>
                </IconButton>
              </ListItem> */}
              <Divider sx={{mb: '10px'}}/>
              <ListItem>
                <Typography variant='body1' sx={{fontWeight: 'bold'}}>Fatura total: {centsToString(statement)}</Typography>
              </ListItem>
              {creditCards.map((creditCard: creditCardWithStatementInterface) => (
                <ListItem sx={{width: '100%'}} key={creditCard.id}>
                  <Accordion sx={{mb: '25px', width: '100%'}}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{backgroundColor: '#B1AFFF'}}>
                      <Grid container direction={'row'} alignItems={'center'} sx={{width: '100%'}}>
                        <WalletIcon/>
                        <Typography variant='body1' sx={{ml: '15px', fontWeight: 'bold'}}>{creditCard.card_name}</Typography>
                        <Typography variant='body1' sx={{ml: 'auto', fontWeight: 'bold'}}>{centsToString(creditCard.statement)}</Typography>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={{pb: '0'}}>
                      <List>
                        {creditCard.Expenses.map((expense: expenseInterface) => (
                          <ListItem sx={{p: '0', mt: '10px', mb: '20px'}} key={expense.id}>
                            <Grid container sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                              <Grid item container direction={'row'} xs={8} sx={{pr: '10px', overflow: 'hidden'}}>
                                {/* <Checkbox sx={{p: '0'}}/> */}
                                <Box sx={{ml: '10px'}}>
                                  <Typography variant='body1' sx={{fontSize: '15px'}}>{expense.description}</Typography>
                                  <Typography variant='caption' sx={{fontSize: '12px'}}>{dateFormatter(expense.date)}</Typography>
                                </Box>
                              </Grid>
                              <Grid item container direction={'row'} xs={4} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography variant='body2' sx={{fontSize: '14px', pr: '2px'}}>{centsToString(expense.amount)}</Typography>
                                <IconButton onClick={() => handleDeleteExpense(expense.id)} sx={{p: '0 !important'}}>
                                  <DeleteForeverIcon sx={{fontSize: '30px', color: 'red'}}/>
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
                        <ListItem>
                          <Grid onClick={() => handleOpenCreateExpense(creditCard.id)} container justifyContent={'center'} sx={{width: '100%', border: '1px dashed #000', borderRadius: '5px'}}>
                            <IconButton >
                              <AddIcon/>
                            </IconButton>
                          </Grid>
                          <Modal 
                            open={selectedCardId === creditCard.id} onClose={handleCloseCreateExpense}>
                            <Box sx={style} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                              <TextField
                                id="outlined-basic"
                                label="Descrição"
                                variant="outlined"
                                sx={{mb: '15px', width: '100%'}}
                                value={expenseDescription}
                                onChange={(e) => setExpenseDescription(e.target.value)}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Valor"
                                variant="outlined"
                                sx={{mb: '15px', mt: '10px', width: '100%'}}
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                              />
                              <Button variant='contained' sx={{borderRadius: '5px', mt: '10px', mb: '10px'}} onClick={() => handleCreateExpense(creditCard.id)}>
                                 Adicionar despesa
                              </Button>
                            </Box>
                          </Modal>
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
