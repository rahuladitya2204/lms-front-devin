import { LoginData, SignupData } from '../../types/Common.types'
import { LoginUser, RegisterUser } from './api'

import { saveItemToStorage } from '../../utils/storage'
import useAuthentication from '../../store/useAuthentication'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

export const useLoginUser = () => {
  const navigate = useNavigate()
  const { setIsSignedin } = useAuthentication(state => state)
  const mutation = useMutation(({ email, password }: LoginData) => {
    return LoginUser({
      email,
      password
    }).then(({ data: { token, user } }) => {
      saveItemToStorage('token', token)
      setIsSignedin(true)
      navigate('/user/dashboard/home')
    })
  })
  return mutation
}

export const useRegisterUser = () => {
  const mutation = useMutation(({ email, password, name }: SignupData) => {
    return RegisterUser({
      email,
      password,
      name
    })
  })
  return mutation
}
