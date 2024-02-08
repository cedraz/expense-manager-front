'use client'
import * as React from 'react'

// Material UI
import { Typography, Grid, IconButton, Divider, Box, List, ListItem, Accordion, AccordionSummary, AccordionDetails, Checkbox, Modal, Button, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import WalletIcon from '@mui/icons-material/Wallet'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'
import CircularProgress from '@mui/material/CircularProgress'
import EditIcon from '@mui/icons-material/Edit'

// Utils
import handleMessageError from '@/utils/handleMessageError'
import { stringToCents } from '@/utils/stringToCents'
import { centsToString } from '@/utils/centsToString'
import { dateFormatter } from '@/utils/dateFormatter'

// Services
import { getCreditCards } from '@/services/credit-cards/getCreditCards'
import { createExpense } from '@/services/expenses/createExpense'
import { deleteManyExpense } from '@/services/expenses/delete-many-expenses'
import { updateExpense } from '@/services/expenses/update-expense'

// Toastify
import { toast } from 'react-toastify'

// Interfaces
import { 
  creditCardInterface, 
  creditCardWithStatementInterface, 
  expenseInterface
} from '../../types/interfaces'

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
  const [ creditCards, setCreditCards ] = React.useState<creditCardWithStatementInterface[]>([])
  const [ statement, setStatement ] = React.useState(0)
  
  const [ expenseDescription, setExpenseDescription ] = React.useState<string>('')
  const [ expenseAmount, setExpenseAmount ] = React.useState<string>('')

  const [ newExpenseDescription, setNewExpenseDescription ] = React.useState<string>('')
  const [ newExpenseAmount, setNewExpenseAmount ] = React.useState<string>('')

  const [ selectedCardId, setSelectedCardId ] = React.useState<string | null>(null) 
  const [ selectedExpenseId, setSelectedExpenseId ] = React.useState<string | null>(null)
  const [ loading, setLoading ] = React.useState<boolean>(false)

  const handleOpen = (expenseId: string) => {
    setSelectedExpenseId(expenseId)
  }
  const handleClose = () => {
    setNewExpenseDescription('')
    setNewExpenseAmount('')
    setSelectedExpenseId(null)
  }

  React.useEffect(() => {
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) return
      setToken(storedToken)

      setLoading(true)

      handleGetExpenses(storedToken)
    }

  }, [setToken])

  const handleOpenCreateExpense = (cardId: string) => {
    setSelectedCardId(cardId)
  }

  const handleCloseCreateExpense = () => {
    setSelectedCardId(null)
  }

  const handleCreateExpense = async (creditCardId: string) => {
    try {
      const amount = stringToCents(expenseAmount)

      if (!amount) {
        toast.error('Digite um valor válido.')
        return
      }

      if (expenseDescription == '' || expenseDescription == undefined) {
        toast.error('Digite uma descrição válida. Mínimo de 1 e Máximo de 40 caracteres.')
        return
      }

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

      setStatement((prevStatement) => prevStatement + amount)
  
      setSelectedCardId(null)
      setExpenseDescription('')
      setExpenseAmount('')
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  const handleDeleteManyExpenses = async () => {
    const expensesToDelete = creditCards.reduce<expenseInterface[]>((acc, creditCard) => {
      return acc.concat(creditCard.Expenses.filter((expense) => expense.selected))
    }, [])

    try {
      const expensesToDeleteIds = expensesToDelete.map(expense => expense.id)

      const response = await deleteManyExpense(token, expensesToDeleteIds)
  
      setCreditCards((prevCreditCards) => {
        const updatedCreditCards = prevCreditCards.map((creditCard) => {
          const valuesToDelete = expensesToDelete.reduce((acc, expense) => {
            if (creditCard.id === expense.credit_card_id) {
              return acc + expense.amount
            }
            return acc
          }, 0)
      
          return {
            ...creditCard,
            Expenses: creditCard.Expenses.filter((expense) => !expensesToDelete.some(expToDelete => expToDelete.id === expense.id)),
            statement: creditCard.statement - valuesToDelete,
          }
        })
      
        const totalStatement = updatedCreditCards.reduce((acc, creditCard) => acc + creditCard.statement, 0)
        setStatement(totalStatement)
      
        return updatedCreditCards
      })
  
      toast.success(`${response.count} despesa(s) deletada(s) com sucesso!`)
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  const isAtLeastOneSelected = () => {
    let isSelected = false
    creditCards.forEach((creditCard) => {
      if (creditCard.Expenses.some((expense) => expense.selected)) {
        isSelected = true
      }
    })
    return isSelected
  }

  const handleCheckBoxChange = (expenseId: string, isSelected: boolean) => {
    const newCreditCards = creditCards.map((creditCard) => {
      if (creditCard.Expenses.some((expense) => expense.id === expenseId)) {
        return {
          ...creditCard,
          Expenses: creditCard.Expenses.map((expense) => {
            if (expense.id === expenseId) {
              return {
                ...expense,
                selected: isSelected,
              }
            }
            return expense
          }),
        }
      }
      return creditCard
    })

    setCreditCards(newCreditCards)
  }
  
  const handleGetExpenses = async (token: string) => {
    try {
      const creditCards = await getCreditCards(token)

      console.log(creditCards)

      const newCreditCards = creditCards.map((creditCard: creditCardInterface) => {
        const creditCardStatement = creditCard.Expenses.reduce((accExpenses: number, expense: expenseInterface) => {
          return accExpenses + expense.amount
        }, 0)

        return {
          ...creditCard,
          statement: creditCardStatement,
          Expenses: creditCard.Expenses.map((expense: expenseInterface) => {
            return {
              ...expense,
              selected: false,
            }
          })
        }
      })

      const totalStatement = newCreditCards.reduce((acc: number, creditCard: creditCardWithStatementInterface) => {
        return acc + creditCard.statement
      }, 0)

      setStatement(totalStatement)
      setCreditCards(newCreditCards)
      setLoading(false)
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  const handleUpdateExpense = async (expenseId: string | null, creditCardId: string) => {
    try {
      if (!expenseId) {
        toast.error('Seleciona uma despesa para atualizar.')
        return
      }

      const newAmount = stringToCents(newExpenseAmount)

      if (!newAmount) {
        toast.error('Digite um valor válido.')
        return
      }

      if (newExpenseDescription == '' || newExpenseDescription == undefined) {
        toast.error('Digite uma descrição válida. Mínimo de 1 e Máximo de 40 caracteres.')
        return
      }

      const newExpense = await updateExpense({
        token, 
        expenseId, 
        description: newExpenseDescription, 
        amount: newAmount
      })

      setCreditCards((prevCreditCards) => {
        return prevCreditCards.map((creditCard) => {
          if (creditCard.id === creditCardId) {
            const updatedExpenses = creditCard.Expenses.map((expense) => {
              if (expense.id === newExpense.id) {
                return newExpense
              }
              return expense
            })
      
            const updatedStatement = updatedExpenses.reduce((total, expense) => total + expense.amount, 0)
      
            return {
              ...creditCard,
              Expenses: updatedExpenses,
              statement: updatedStatement,
            }
          }
          return creditCard
        })
      })

      setSelectedExpenseId(null)
      setNewExpenseDescription('')
      setNewExpenseAmount('')
      toast.success('Despesa atualizada com sucesso.')
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  return (
    <>
      <Grid sx={{minHeight: '100vh', height: '100%'}} className='fundo-padrao'>
        <Grid container direction={'column'} >

          <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center'}}>

            <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px', mt: '30px', fontSize: '40px'}}>
              <span style={blue}>DES</span><span style={red}>PE</span><span style={orange}>SAS</span>
            </Typography>

            {loading && <CircularProgress size={70} sx={{
              position: 'absolute', 
              zIndex: 10,
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-35px',
            }} />}

            <List sx={{width: '100%',}}>
              <ListItem sx={{display: 'flex', justifyContent: 'flex-end'}}>                
                <Typography variant='body2'>Remover despesas</Typography>
                <IconButton disabled={!isAtLeastOneSelected()} color={'error'} onClick={handleDeleteManyExpenses}>
                  <DeleteForeverIcon/>
                </IconButton>
              </ListItem>
              <Divider sx={{mb: '10px'}}/>
              <ListItem>
                <Typography variant='body1' sx={{fontWeight: 'bold'}}>Fatura total: {centsToString(statement)}</Typography>
              </ListItem>

              {creditCards.map((creditCard: creditCardWithStatementInterface) => (
                <ListItem sx={{width: '100%'}} key={creditCard.id}>
                  <Accordion sx={{width: '100%'}}>
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
                              <Grid item container xs={12}>
                                <Typography variant='body1' sx={{fontSize: '15px', width: '100%'}}>{expense.description}</Typography>
                              </Grid>
                              <Grid item container direction={'row'} xs={7} sx={{pr: '5px', overflow: 'hidden'}} alignItems={'center'}>
                                <Checkbox sx={{p: '0'}} checked={expense.selected === true}
                                  onChange={() => handleCheckBoxChange(expense.id, !expense.selected)
                                  }/>
                                <Typography variant='caption' sx={{fontSize: '12px', ml: '15px'}}>{dateFormatter(expense.date)}</Typography>
                              </Grid>
                              <Grid item container direction={'row'} xs={3} justifyContent={'flex-end'} alignItems={'center'}>
                                <Typography variant='body2' sx={{fontSize: '14px', pr: '2px'}}>{centsToString(expense.amount)}</Typography>
                              </Grid>
                              <Grid item container direction={'row'} xs={2} justifyContent={'flex-end'} alignItems={'center'}>
                                <IconButton onClick={() => handleOpen(expense.id)}>
                                  <EditIcon sx={{width: '20px'}}/>
                                </IconButton>
                                <Modal 
                                  open={selectedExpenseId === expense.id}
                                  onClose={handleClose}
                                >
                                  <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: '15px'}}>
                                      Atualize sua despesa
                                    </Typography>

                                    <TextField
                                      id="outlined-basic"
                                      label="Descrição"
                                      variant="outlined"
                                      sx={{mb: '15px', width: '100%'}}
                                      value={newExpenseDescription}
                                      onChange={(e) => setNewExpenseDescription(e.target.value)}
                                    />
                                    <TextField
                                      id="outlined-basic"
                                      label="Valor"
                                      variant="outlined"
                                      sx={{mb: '15px', mt: '10px', width: '100%'}}
                                      value={newExpenseAmount}
                                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                                    />
                                    <Button variant='contained' sx={{borderRadius: '5px', mt: '10px', mb: '10px'}} onClick={() =>  handleUpdateExpense(expense.id, expense.credit_card_id)}>
                                      Atualizar despesa
                                    </Button>
                                  </Box>
                                </Modal>
                              </Grid>
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
