import { Learner, Network, Types } from '@adewaskar/lms-common'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { INITIAL_LEARNER_DETAILS } from 'constant.ts'
import { message } from 'antd'
import { saveItemToStorage } from '@Utils/storage'
import useAuthentication from '@Store/useAuthentication'
import { useNavigate } from 'react-router'

// Login - register

export const useLoginLearner = () => {
  const navigate = useNavigate()
  const { setIsSignedin } = useAuthentication(state => state)
  const mutation = useMutation(({ email, password }: Types.LoginData) => {
    return Learner.Api.LoginLearner({
      email,
      password
    }).then(({ data: { token, user } }) => {
      saveItemToStorage('learner-auth-token', token)
      setIsSignedin(true)
      navigate(`/learner/${user.organisation}/dashboard/courses`)
    })
  })
  return mutation
}

export const useRegisterLearner = () => {
  const mutation = useMutation(
    ({ email, password, name }: Types.SignupData) => {
      return Learner.Api.RegisterLearner({
        email,
        password,
        name
      })
    }
  )
  return mutation
}

// Courses

export const useGetLearnerDetails = (options = { enabled: true }) => {
  const { data = INITIAL_LEARNER_DETAILS, isFetching: isLoading } =
    useQuery <
    Types.Learner >
    ([Network.KEYS.GET_LEARNER_DETAILS], () => Learner.Api.GetLearnerDetails(), options)
  return {
    data,
    isLoading
  }
}

export const useUpdateLearner = () => {
  const qc = useQueryClient()
  const mutation = useMutation(
    ({ data }: { data: Partial<Types.Learner> }): Promise<void> => {
      return Learner.Api.UpdateLearner(data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_LEARNER_DETAILS])
        message.success('Learner Details Updated')
      })
    }
  )

  return mutation
}
