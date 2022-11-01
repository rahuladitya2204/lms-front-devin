import { LoginData } from '../../../types/Common.types'
import { LoginUser } from '../api'
import { saveItemToStorage } from '../../../utils/storage'
import useAuthentication from '../../../store/useAuthentication'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

const useLogin = () => {
  const navigate = useNavigate()
  const { setIsSignedin } = useAuthentication(state => state)
  const mutation = useMutation(({ email, password }: LoginData) => {
    return LoginUser({
      email,
      password
    }).then(({ data: { token, user } }) => {
      saveItemToStorage('token', token)
      setIsSignedin(true)
      navigate('/app/admin/dashboard/home')
    })
  })
  return mutation
}

export default useLogin
