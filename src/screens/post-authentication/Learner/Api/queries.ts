import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useNavigate } from "react-router"
import { GetLearnerCourseDetails, GetLearnerCourses, GetLearnerDetails, LoginLearner, RegisterLearner, UpdateLearner } from "."
import { KEYS } from "../../../../network/keys"
import useAuthentication from "../../../../store/useAuthentication"
import { LoginData, SignupData } from "../../../../types/Common.types"
import { Course } from "../../../../types/Courses.types"
import { CreateLearnerPayload, Learner } from "../../../../types/Learner.types"
import { saveItemToStorage } from "../../../../utils/storage"



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

export const useGetCourses = () => {
  const { data = [], isFetching: isLoading } =
    useQuery<Course[]>([KEYS.GET_COURSES], GetLearnerCourses)
  return {
    data,
    isLoading
  }
}

export const INITIAL_COURSE_DETAILS:Course = {
  title: '',
  subtitle: '',
  description:'',
  instructor: '',
  sections: [],
  thumbnailImage:'',
  _id: '',
  howToUse: '',
  whatYouLearn: [''],
  requirements:['']
}

export const useGetCourseDetails = (id:string,options={enabled:true}) => {
  const { data = INITIAL_COURSE_DETAILS , isFetching: isLoading } =
    useQuery<Course>([KEYS.GET_COURSE_DETAILS, id], () => GetLearnerCourseDetails(id), options)
  return {
    data,
    isLoading
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
