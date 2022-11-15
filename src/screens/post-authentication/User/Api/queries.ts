import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { LoginUser, RegisterUser } from '.'
import useAuthentication from '@Store/useAuthentication'
import { LoginData, SignupData } from '@Types/Common.types'
import { saveItemToStorage } from '@Utils/storage'

export const useLoginUser = () => {
  const navigate = useNavigate()
  const { setIsSignedin } = useAuthentication(state => state)
  const mutation = useMutation(({ email, password }: LoginData) => {
    return LoginUser({
      email,
      password
    }).then(({ data: { token, user } }) => {
      saveItemToStorage('user-auth-token', token)
      setIsSignedin(true)
      navigate('/user/dashboard/courses')
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
