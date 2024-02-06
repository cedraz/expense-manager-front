'use client'
import * as React from 'react'

// Material UI
import { Typography, IconButton, Divider, Box, List, ListItem, Checkbox, Modal, Grid, Button, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'
import CircularProgress from '@mui/material/CircularProgress'
import EditIcon from '@mui/icons-material/Edit'

// Utils
import handleMessageError from '@/utils/handleMessageError'
import { centsToString } from '@/utils/centsToString'
import { dateFormatter } from '@/utils/dateFormatter'
import { stringToCents } from '@/utils/stringToCents'

// Services
import { getCharges } from '@/services/charges/get-charges'
import { createCharge } from '@/services/charges/create-charge'
import { deleteManyCharges } from '@/services/charges/delete-many-charges'

//Toastify
import { toast } from 'react-toastify'

// Interfaces
import { chargeInterface } from '@/types/interfaces'
import { updateCharge } from '@/services/charges/update-charge'

export default function Charges() {
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
  const [ open, setOpen ] = React.useState(false)
  const [ charges, setCharges ] = React.useState<chargeInterface[]>([])
  const [ newChargeDescription, setNewChargeDescription ] = React.useState<string>('')
  const [ newChargeAmount, setNewChargeAmount ] = React.useState<string>('')
  const [ isAllSelected, setIsAllSelected ] = React.useState<boolean>(false)
  const [ loading, setLoading ] = React.useState<boolean>(false)

  const [ selectedChargeId, setSelectedChargeId ] = React.useState<string | null>(null)

  const [ updatedChargeDescription, setUpdatedChargeDescription ] = React.useState<string>('')
  const [ updatedChargeAmount, setUpdatedChargeAmount ] = React.useState<string>('')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) return
      setToken(storedToken)
      setLoading(true)
      handleGetCharges(storedToken)
    }
  }, [setToken])

  React.useEffect(() => {
    setIsAllSelected(isAllChargesSelected())
  }, [charges])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOpenChargeUpdate = (chargeId: string) => {
    setSelectedChargeId(chargeId)
  }

  const handleCloseChargeUpdate = () => {
    setSelectedChargeId(null)
    setUpdatedChargeDescription('')
    setUpdatedChargeAmount('')
  }

  const isAtLeastOneSelected = () => {
    return Object.values(charges).some((charge) => charge.selected)
  }

  const isAllChargesSelected = () => {
    if (charges.length === 0) return false
    return Object.values(charges).every((charge) => charge.selected)
  }

  const handleGetCharges = async (token: string) => {
    try {
      const response = await getCharges(token)

      const charges = response.data.map((charge: chargeInterface) => {
        return {
          ...charge,
          selected: false
        }
      })

      setCharges(charges)
      setLoading(false)
    } catch (error) {
      handleMessageError(error)
    }
  }

  const handleCreateCharge = async () => {
    try {
      const amount = stringToCents(newChargeAmount)

      if (!amount) {
        toast.error('Digite um valor válido.')
        return
      }

      if (newChargeDescription == '' || newChargeDescription == undefined) {
        toast.error('Digite uma descrição válida. Mínimo de 1 e Máximo de 40 caracteres.')
        return
      }

      const response = await createCharge(token, newChargeDescription, amount)
      
      setCharges([...charges, {...response.data, selected: false}])

      handleClose()
      setNewChargeDescription('')
      setNewChargeAmount('')
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  const handleCheckboxChange = (chargeId: string, isChecked: boolean) => {
    const newCharges = charges.map((charge) => {
      if (charge.id === chargeId) {
        return {
          ...charge,
          selected: isChecked
        }
      }
      return charge
    })

    setCharges(newCharges)
  }

  const handleSelectAllCheckboxes = (allSelected: boolean) => {
    setCharges((prevCharges) => {
      return prevCharges.map((charge) => {
        return {
          ...charge,
          selected: allSelected,
        }
      })
    })
  
    setIsAllSelected(allSelected)
  }

  const handleDeleteManyCharges = async () => {
    const chargesToDelete = charges.filter((charge) => charge.selected).map((charge) => charge.id)
    const response = await deleteManyCharges(token, chargesToDelete)

    setCharges((prevCharges) => {
      return prevCharges.filter((charge) => !chargesToDelete.includes(charge.id))
    })

    setIsAllSelected(false)

    toast.success(`${response.data.count} cobrança(s) deletadas com sucesso!`)
  }

  const handleUpdateCharge = async (chargeId: string) => {
    try {
      const newAmount = stringToCents(updatedChargeAmount)

      if (!newAmount) {
        toast.error('Digite um valor válido.')
        return
      }

      if (updatedChargeDescription == '' || updatedChargeDescription == undefined) {
        toast.error('Digite uma descrição válida. Mínimo de 1 e Máximo de 40 caracteres.')
        return
      }

      const newCharge = await updateCharge({token, chargeId, description: updatedChargeDescription, amount: newAmount})

      setCharges((prevCharges) => {
        return prevCharges.map((charge) => {
          if (charge.id === chargeId) {
            return {
              ...newCharge,
              selected: charge.selected
            }
          }
          return charge
        })
      })

      setSelectedChargeId(null)
      setUpdatedChargeDescription('')
      setUpdatedChargeAmount('')
      toast.success('Cobrança atualizada com sucesso.')
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  return (
    <>
      <Grid sx={{minHeight: '100vh', height: '100%'}} className='fundo-padrao'>
        
        <Grid container direction={'column'} >

          <Grid container direction={'column'} item xs={12} sx={{display: 'flex', alignItems: 'center'}}>

            <Typography variant='h4' sx={{fontWeight: 'bold', mb: '15px', fontSize: '40px', mt: '30px'}}>
              <span style={blue}>CO</span><span style={red}>BRAN</span><span style={orange}>ÇAS</span>
            </Typography>

            {loading && <CircularProgress size={70} sx={{
              position: 'absolute', 
              zIndex: 10,
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-35px',
            }} />}

            <List sx={{
              width: '100%', backgroundColor: 'white', 
              borderRadius: '5px', 
              p: '4px 8px',
            }}>
              <ListItem sx={{justifyContent: 'space-between'}}>
                <Grid container direction={'row'} alignItems={'center'}>
                  <Checkbox checked={isAllSelected} onChange={() => handleSelectAllCheckboxes(!isAllSelected)}/>
                  <Typography variant='body2' sx={{ml: '5px'}}>Selecionar todos</Typography>
                </Grid>
                <IconButton disabled={!isAtLeastOneSelected()} color={'error'} onClick={handleDeleteManyCharges}>
                  <DeleteForeverIcon />
                </IconButton> 
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
                <ListItem sx={{mt: '5px', mb: '5px'}} key={charge.id}>
                  <Grid container sx={{
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    
                  }}>
                    <Grid item container direction={'row'} xs={6} sx={{pr: '10px', overflow: 'hidden'}}>
                      <Checkbox  
                        checked={charge.selected}
                        onChange={() => handleCheckboxChange(charge.id, !charge.selected)
                        }/>
                      <Box sx={{ml: '5px'}}>
                        <Typography variant='body1' sx={{fontSize: '15px'}}>{charge.description}</Typography>
                        <Typography variant='caption' sx={{fontSize: '12px'}}>{dateFormatter(charge.date)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item container direction={'row'} xs={4} justifyContent={'flex-end'} alignItems={'center'}>
                      <Typography variant='body2' sx={{fontSize: '15px', pr: '2px'}}>{centsToString(charge.amount)}</Typography>
                    </Grid>
                    <Grid item container direction={'row'} xs={2} justifyContent={'flex-end'} alignItems={'center'}>
                      <IconButton onClick={() => handleOpenChargeUpdate(charge.id)}>
                        <EditIcon/>
                      </IconButton>
                      <Modal 
                        open={selectedChargeId === charge.id}
                        onClose={handleCloseChargeUpdate}
                      >
                        <Box sx={style}>
                          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: '15px'}}>
                          Atualize sua cobrança
                          </Typography>

                          <TextField
                            id="outlined-basic"
                            label="Descrição"
                            variant="outlined"
                            sx={{mb: '15px', width: '100%'}}
                            value={updatedChargeDescription}
                            onChange={(e) => setUpdatedChargeDescription(e.target.value)}
                          />
                          <TextField
                            id="outlined-basic"
                            label="Valor"
                            variant="outlined"
                            sx={{mb: '15px', mt: '10px', width: '100%'}}
                            value={updatedChargeAmount}
                            onChange={(e) => setUpdatedChargeAmount(e.target.value)}
                          />
                          <Button variant='contained' sx={{borderRadius: '5px', mt: '10px', mb: '10px'}} onClick={() =>  handleUpdateCharge(charge.id)}>
                            Atualizar cobrança
                          </Button>
                        </Box>
                      </Modal>
                    </Grid>
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
