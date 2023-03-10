import { Constants, Types } from '@adewaskar/lms-common'
import {
  GetUserAccountDetails,
  LoginUser,
  RegisterUser,
  UpdateUserAccount
} from '.'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { KEYS } from '@Network/keys'
import { message } from 'antd'
import { saveItemToStorage } from '@Utils/storage'
import useAuthentication from '@Store/useAuthentication'
import { useNavigate } from 'react-router'

export const useLoginUser = () => {
  const navigate = useNavigate()
  const { setIsSignedin } = useAuthentication(state => state)
  const mutation = useMutation(({ email, password }: Types.LoginData) => {
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
  const mutation = useMutation(({ email, password, name }: Types.SignupData) => {
    return RegisterUser({
      email,
      password,
      name
    })
  })
  return mutation
}

export const useGetUserAccountDetails = (options = { enabled: true }) => {
  const { data = Constants.INITIAL_ORG_DETAILS, isFetching: isLoading } =
    useQuery <
    Types.Organisation >
    ([KEYS.GET_USER_ACCOUNT_DETAILS], () => GetUserAccountDetails(), options)
  return {
    data,
    isLoading
  }
}

export const useGetOrgDetails = (options = { enabled: true }) => {
  const { data = Constants.INITIAL_ORG_DETAILS, isFetching: isLoading } =
    useQuery <
    Types.Organisation >
    ([KEYS.GET_USER_ACCOUNT_DETAILS], () => GetUserAccountDetails(), options)
  return {
    data,
    isLoading
  }
}

export const useUpdateUserAccount = () => {
  const qc = useQueryClient()
  const mutation = useMutation(
    ({ data }: { data: Partial<Types.Organisation> }): Promise<void> => {
      return UpdateUserAccount(data).then(() => {
        qc.invalidateQueries([KEYS.GET_USER_ACCOUNT_DETAILS])
        message.success('User Account Details Updated')
      })
    }
  )

  return mutation
}
