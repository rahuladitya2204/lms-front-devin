import {
  GetUserAccountDetails,
  LoginUser,
  RegisterUser,
  UpdateUserAccount
} from '.'
import { LoginData, SignupData } from '@Types/Common.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { INITIAL_ORG_DETAILS } from 'constant.ts'
import { KEYS } from '@Network/keys'
import { Organisation } from '@Types/Organisation'
import { message } from 'antd'
import { saveItemToStorage } from '@Utils/storage'
import useAuthentication from '@Store/useAuthentication'
import { useNavigate } from 'react-router'

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

export const useGetUserAccountDetails = (options = { enabled: true }) => {
  const { data = INITIAL_ORG_DETAILS, isFetching: isLoading } =
    useQuery <
    Organisation >
    ([KEYS.GET_USER_ACCOUNT_DETAILS], () => GetUserAccountDetails(), options)
  return {
    data,
    isLoading
  }
}

export const useGetOrgDetails = (options = { enabled: true }) => {
  const { data = INITIAL_ORG_DETAILS, isFetching: isLoading } =
    useQuery <
    Organisation >
    ([KEYS.GET_USER_ACCOUNT_DETAILS], () => GetUserAccountDetails(), options)
  return {
    data,
    isLoading
  }
}

export const useUpdateUserAccount = () => {
  const qc = useQueryClient()
  const mutation = useMutation(
    ({ data }: { data: Partial<Organisation> }): Promise<void> => {
      return UpdateUserAccount(data).then(() => {
        qc.invalidateQueries([KEYS.GET_USER_ACCOUNT_DETAILS])
        message.success('User Account Details Updated')
      })
    }
  )

  return mutation
}
