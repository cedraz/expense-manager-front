'use client'
import * as React from 'react'
import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  nome: string
}

async function registerUser(data: Inputs) {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto')
  console.log(data)
  return response
}

export default function Register() {

  const { register, handleSubmit } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await registerUser(data)
    if (response.status === 200) {
      console.log(response)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" {...register('nome')} />
      <button type='submit'>
        cadastrar
      </button>
    </form>
  )
}
