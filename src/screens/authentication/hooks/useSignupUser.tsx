import { SignupData } from '../../../types/Common.types'
import { SignupUser } from '../api'
import { useMutation } from '@tanstack/react-query'

const useSignup = () => {
  const mutation = useMutation(({ email, password, name }: SignupData) => {
    return SignupUser({
      email,
      password,
      name
    })
  })
  return mutation
}

export default useSignup
