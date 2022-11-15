import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useNavigate } from "react-router"
import {   GetLearnerDetails, LoginLearner, RegisterLearner, UpdateLearner } from "."
import { KEYS } from "@Network/keys"
import useAuthentication from "@Store/useAuthentication"
import { LoginData, SignupData } from "@Types/Common.types"
import {  Learner } from "@Types/Learner.types"
import { saveItemToStorage } from "@Utils/storage"
import {  INITIAL_LEARNER_DETAILS } from "constant.ts"

// Login - register

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


// Courses



export const useGetLearnerDetails = (options={enabled:true}) => {
  const { data = INITIAL_LEARNER_DETAILS , isFetching: isLoading } =
    useQuery<Learner>([KEYS.GET_LEARNER_DETAILS], () => GetLearnerDetails(), options)
  return {
    data,
    isLoading
  }
}

export const useUpdateLearner = () => {
  const qc = useQueryClient();
  const mutation = useMutation(({data}:{data: Partial<Learner>}): Promise<void> => {
    return UpdateLearner(data).then(() => {
      qc.invalidateQueries([KEYS.GET_LEARNER_DETAILS]);
      message.success('Learner Details Updated');
    })
  });

  return mutation;
}





