import { LoginData, SignupData } from '../../types/Common.types'
import { LoginLearner, RegisterLearner } from './api'

import { saveItemToStorage } from '../../utils/storage'
import useAuthentication from '../../store/useAuthentication'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

export const useLoginLearner = () => {
  const navigate = useNavigate()
  const { setIsSignedin } = useAuthentication(state => state)
  const mutation = useMutation(({ email, password }: LoginData) => {
    return LoginLearner({
      email,
      password
    }).then(({ data: { token, user } }) => {
      saveItemToStorage('token', token)
      setIsSignedin(true)
      navigate('/learner/dashboard/home')
    })
  })
  return mutation
}

export const useRegisterLearner = () => {
  const mutation = useMutation(({ email, password, name }: SignupData) => {
    return RegisterLearner({
      email,
      password,
      name
    })
  })
  return mutation
}
