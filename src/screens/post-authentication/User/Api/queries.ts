import { Constants, Network, Types, User } from '@adewaskar/lms-common'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { message } from 'antd'
import { saveItemToStorage } from '@Utils/storage'
import useAuthentication from '@Store/useAuthentication'
import { useNavigate } from 'react-router'

export const useLoginUser = () => {
  const navigate = useNavigate()
  const { setIsSignedin } = useAuthentication(state => state)
  const mutation = useMutation(({ email, password }: Types.LoginData) => {
    return User.Api.LoginUser({
      email,
      password
    }).then(({ data: { token } }) => {
      saveItemToStorage('user-auth-token', token)
      setIsSignedin(true)
      navigate('/user/dashboard/courses')
    })
  })
  return mutation
}

export const useRegisterUser = () => {
  const mutation = useMutation(
    ({ email, password, name }: Types.SignupData) => {
      return User.Api.RegisterUser({
        email,
        password,
        name
      })
    }
  )
  return mutation
}

export const useGetUserAccountDetails = (options = { enabled: true }) => {
  const { data = Constants.INITIAL_ORG_DETAILS, isFetching: isLoading } =
    useQuery <
    Types.Organisation >
    ([Network.KEYS.GET_USER_ACCOUNT_DETAILS],
    () => User.Api.GetUserAccountDetails(),
    options)
  return {
    data,
    isLoading
  }
}

export const useGetOrgDetails = (options = { enabled: true }) => {
  const { data = Constants.INITIAL_ORG_DETAILS, isFetching: isLoading } =
    useQuery <
    Types.Organisation >
    ([Network.KEYS.GET_USER_ACCOUNT_DETAILS],
    () => User.Api.GetUserAccountDetails(),
    options)
  return {
    data,
    isLoading
  }
}

export const useUpdateUserAccount = () => {
  const qc = useQueryClient()
  const mutation = useMutation(
    ({ data }: { data: Partial<Types.Organisation> }): Promise<void> => {
      return User.Api.UpdateUserAccount(data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_USER_ACCOUNT_DETAILS])
        message.success('User Account Details Updated')
      })
    }
  )

  return mutation
}
