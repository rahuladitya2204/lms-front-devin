import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useNavigate } from "react-router"
import { createDiscussionQuestion, createDiscussionQuestionAnswer, enrollForCourse, GetCourseQuestions, getCoursesOfOrganisation, GetLearnerCourseDetails, GetLearnerCourses, GetLearnerDetails, LoginLearner, RegisterLearner, UpdateLearner } from "."
import { KEYS } from "@Network/keys"
import useAuthentication from "@Store/useAuthentication"
import { LoginData, SignupData } from "@Types/Common.types"
import { Course, CourseQuestion, CourseQuestionAnswer } from "@Types/Courses.types"
import { CreateLearnerPayload, Learner } from "@Types/Learner.types"
import { saveItemToStorage } from "@Utils/storage"



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
  plan:'',
  whatYouLearn: '',
  requirements:''
}

export const INITIAL_COURSE_PLAN_DETAILS = {
  name: '',
  type:'one-time',
  finalPrice: {
    value:''
  },
  listPrice: {
    value:''
  }
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

export const useCreateDiscussionQuestion = (onSuccess:()=>void) => {
  const qc = useQueryClient();
  const mutation = useMutation(({id,data}:{id:string,data: Partial<CourseQuestion>}): Promise<void> => {
    return createDiscussionQuestion(id, data).then(() => {
      qc.invalidateQueries([KEYS.GET_COURSE_QUESTIONS]);
      message.success('Query Posted');
    })
  }, {
    onSuccess:()=>onSuccess()
  });

  return mutation;
}

export const useCreateDiscussionQuestionAnswer = (onSuccess:()=>void) => {
  const qc = useQueryClient();
  const mutation = useMutation(({courseId,questionId,data}:{courseId:string,questionId:string,data: Partial<CourseQuestionAnswer>}): Promise<void> => {
    return createDiscussionQuestionAnswer(courseId,questionId, data).then(() => {
      qc.invalidateQueries([KEYS.GET_COURSE_QUESTIONS]);
      message.success('Answer Posted');
    })
  }, {
    onSuccess:()=>onSuccess()
  });
  return mutation;
}


export const useEnrollForCourse = (onSuccess:()=>void) => {
  const qc = useQueryClient();
  const mutation = useMutation(({courseId}:{courseId:string}): Promise<void> => {
    return enrollForCourse(courseId).then(() => {
      message.success('Enrolled for the course. Congratulation!');
    })
  }, {
    onSuccess:()=>onSuccess()
  });
  return mutation;
}


export const useGetCourseQuestions = (courseId:string) => {
  const { data = [], isFetching: isLoading } =
    useQuery<CourseQuestion[]>([KEYS.GET_COURSE_QUESTIONS], ()=>GetCourseQuestions(courseId))
  return {
    data,
    isLoading
  }
}

export const useGetCoursesOfOrganisation = () => {
  const { data = [], isFetching: isLoading } =
    useQuery<Course[]>([KEYS.GET_COURSES_OF_ORGANISATION], ()=>getCoursesOfOrganisation())
  return {
    data,
    isLoading
  }
}