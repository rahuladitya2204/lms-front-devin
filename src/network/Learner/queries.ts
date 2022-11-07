import { LoginData, SignupData } from '../../types/Common.types'
import { CreateLearner, GetLearnerDetails, GetLearners, LoginLearner, RegisterLearner, UpdateLearner } from './api'

import { saveItemToStorage } from '../../utils/storage'
import useAuthentication from '../../store/useAuthentication'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { CreateLearnerPayload, Learner } from '../../types/Learner.types'
import { KEYS } from '../keys'
import { message } from 'antd'


export const INITIAL_LEARNER_DETAILS:Learner = {
   email: '',
   name: '',
   recoveryEmail: '',
   username: '',
   contactNo: '',
   isDeactivated: '',
   status: '',
  createdAt: '',
   _id:''
}


export const useLoginLearner = () => {
  const navigate = useNavigate()
  const { setIsSignedin } = useAuthentication(state => state)
  const mutation = useMutation(({ email, password }: LoginData) => {
    return LoginLearner({
      email,
      password
    }).then(({ data: { token, user } }) => {
      saveItemToStorage('learner-auth-token', token)
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



export const useGetLearners = () => {
  const { data = [], isFetching: isLoading } =
    useQuery<Learner[]>([KEYS.GET_LEARNERS], GetLearners)
  return {
    data,
    isLoading,
    listItems: data.map(i => {
      return {
        value: i._id,
        label:i.name
      }
    })
  }
}
export const useGetLearnerDetails = (id:string,options={enabled:true}) => {
  const { data = INITIAL_LEARNER_DETAILS , isFetching: isLoading } =
    useQuery<Learner>([KEYS.GET_LEARNER_DETAILS, id], () => GetLearnerDetails(id), options)
  return {
    data,
    isLoading
  }
}


export const useCreateLearner = () => {
  const qc = useQueryClient();
  const mutation = useMutation((data: CreateLearnerPayload) => {
    return CreateLearner(data).then((data) => {
      qc.invalidateQueries([KEYS.GET_LEARNERS]);
      message.success('Learners Details Updated');
    });
  })

  return mutation;
}


export const useUpdateLearner = () => {
  const qc = useQueryClient();
  const mutation = useMutation(({id,data}:{id:string,data: Partial<Learner>}): Promise<void> => {
    return UpdateLearner(id, data).then(() => {
      qc.invalidateQueries([KEYS.GET_LEARNERS]);
      message.success('Learner Details Updated');
    })
  });

  return mutation;
}