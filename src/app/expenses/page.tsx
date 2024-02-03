'use client'
import * as React from 'react'

// Material UI
import { Typography, Grid, IconButton, Divider, Box, List, ListItem, Accordion, AccordionSummary, AccordionDetails, Checkbox, Modal, Button, TextField, Card } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import WalletIcon from '@mui/icons-material/Wallet'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'

// Utils
import handleMessageError from '@/utils/handleMessageError'
import { stringToCents } from '@/utils/stringToCents'
import { centsToString } from '@/utils/centsToString'

// Services
import { getCreditCards } from '@/services/credit-cards/getCreditCards'
import { createExpense } from '@/services/expenses/createExpense'
import { deleteExpense } from '@/services/expenses/delete-expense'
import { deleteManyExpense } from '@/services/expenses/delete-many-expenses'

// Toastify
import { toast } from 'react-toastify'

// Interfaces
import { 
  creditCardInterface, 
  creditCardWithStatementInterface, 
  expenseInterface
} from '../../types/interfaces'
import { dateFormatter } from '@/utils/dateFormatter'
import { blue, red, orange } from '@mui/material/colors'
import style from 'styled-jsx/style'

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

  // const [open, setOpen] = React.useState(false)
  const [ token, setToken ] = React.useState<string>('')
  const [ creditCards, setCreditCards ] = React.useState<creditCardWithStatementInterface[]>([])
  const [ selectedExpenses, setSelectedExpenses ] = React.useState<string[]>([])
  const [ statement, setStatement ] = React.useState(0)

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

  // const handleOpen = () => setOpen(true)
  // const handleClose = () => setOpen(false)

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

  // Função para deletar uma despesa (não é mais utilizada)
  // const handleDeleteExpense = async (expenseId: string) => {
  //   try {
  //     await deleteExpense(token, expenseId)
  
  //     setCreditCards((prevCreditCards) => {
  //       return prevCreditCards.map((creditCard) => {
  //         if (creditCard.Expenses.some((expense) => expense.id === expenseId)) {
  //           const newExpenses = creditCard.Expenses.filter((expense) => expense.id !== expenseId)
  //           const newStatement = newExpenses.reduce((acc, expense) => acc + expense.amount, 0)
  
  //           return {
  //             ...creditCard,
  //             Expenses: newExpenses,
  //             statement: newStatement,
  //           }
  //         }
  
  //         return creditCard
  //       })
  //     })
  
  //     toast.success('Despesa deletada com sucesso!')
  //   } catch (error) {
  //     toast.error(handleMessageError(error))
  //   }
  // }

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
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  return (
    <>
      <Grid sx={{minHeight: '100vh', height: '100%'}} className='fundo-padrao'>
        <Grid container direction={'column'} >

          <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center'}}>

            <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px', mt: '30px' ,fontSize: '40px'}}>
              <span style={blue}>DES</span><span style={red}>PE</span><span style={orange}>SAS</span>
            </Typography>

            <List sx={{width: '100%'}}>
              <ListItem sx={{display: 'flex', justifyContent: 'flex-end'}}>
                {/* <Grid container direction={'row'} alignItems={'center'}>
                  <Checkbox />
                  <Typography variant='body2' sx={{ml: '15px'}}>Selecionar todos</Typography>
                </Grid> */}
                
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
                                <Checkbox sx={{p: '0'}} checked={expense.selected === true}
                                  onChange={() => handleCheckBoxChange(expense.id, !expense.selected)
                                  }/>
                                <Box sx={{ml: '10px'}}>
                                  <Typography variant='body1' sx={{fontSize: '15px'}}>{expense.description}</Typography>
                                  <Typography variant='caption' sx={{fontSize: '12px'}}>{dateFormatter(expense.date)}</Typography>
                                </Box>
                              </Grid>
                              <Grid item container direction={'row'} xs={4} justifyContent={'flex-end'} alignItems={'center'}>
                                <Typography variant='body2' sx={{fontSize: '14px', pr: '2px'}}>{centsToString(expense.amount)}</Typography>
                                {/* <IconButton onClick={() => handleDeleteExpense(expense.id)} sx={{p: '0 !important'}}>
                                  <DeleteForeverIcon sx={{fontSize: '30px', color: 'red'}}/>
                                </IconButton> */}
                                
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
