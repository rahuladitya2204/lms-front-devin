import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { useNavigate } from 'react-router'
import { CreateCourse,CreateCoursePlan, CreateInstructor, CreateLearner, GetCourseDetails, GetCoursePlans, GetCourses, GetInstructorDetails, GetInstructors, GetLearnerDetails, GetLearners, LoginUser, RegisterUser, UpdateCourse, UpdateCoursePlan, UpdateInstructor, UpdateLearner } from '.'
import { KEYS } from '@Network/keys'
import useAuthentication from '@Store/useAuthentication'
import { LoginData, SignupData } from '@Types/Common.types'
import { Course, Plan, UpdateCoursePayload } from '@Types/Courses.types'
import { CreateInstructorPayload, Instructor } from '@Types/Instructor.types'
import { CreateLearnerPayload, Learner } from '@Types/Learner.types'
import { saveItemToStorage } from '@Utils/storage'
import { INITIAL_COURSE_DETAILS, INITIAL_LEARNER_DETAILS } from 'constant.ts'

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

// Course

export const useGetCourses = () => {
  const { data = [], isFetching: isLoading } =
    useQuery<Course[]>([KEYS.GET_COURSES], GetCourses)
  return {
    data,
    isLoading
  }
};
  
  export const useGetCourseDetails = (id:string,options={enabled:true}) => {
    const { data = INITIAL_COURSE_DETAILS , isFetching: isLoading } =
      useQuery<Course>([KEYS.GET_COURSE_DETAILS, id], () => GetCourseDetails(id), options)
    return {
      data,
      isLoading
    }
  }
  
  
  export const useCreateCourse = () => {
    const qc = useQueryClient();
    const mutation = useMutation((data: Partial<Course>) => {
      return CreateCourse(data).then(() => {
        qc.invalidateQueries([KEYS.GET_COURSES]);
        message.success('Course Details Updated');
      })
    });
  
    return mutation;
  }
  
  
  export const useUpdateCourse = () => {
    const qc = useQueryClient();
    const mutation = useMutation(({id,data}:{id:string,data: Partial<UpdateCoursePayload>}) => {
      return UpdateCourse(id, data).then(() => {
        qc.invalidateQueries([KEYS.GET_COURSE_DETAILS, id]);
        message.success('Course Details Updated');
  
      })
    });
  
    return mutation;
  }
  


  export const INITIAL_INSTRUCTOR_DETAILS:Instructor = {
    name: '',
    aboutMe: '',
    email: '',
    designation: '',
    image:'',
    createdAt: '',
    updatedAt: '',
    _id: '',
    courses:0,
    organisation:''
    
  }
  
  
  export const useGetInstructors = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Instructor[]>([KEYS.GET_INSTRUCTORS], GetInstructors)
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
  
  export const useGetInstructorDetails = (id:string,options={enabled:true}) => {
    const { data = INITIAL_INSTRUCTOR_DETAILS , isFetching: isLoading } =
      useQuery<Instructor>([KEYS.GET_INSTRUCTOR_DETAILS, id], () => GetInstructorDetails(id), options)
    return {
      data,
      isLoading
    }
  }
  
  
  export const useCreateInstructor = () => {
    const qc = useQueryClient();
    const mutation = useMutation((data: CreateInstructorPayload) => {
      return CreateInstructor(data).then(() => {
        qc.invalidateQueries([KEYS.GET_INSTRUCTORS]);
        message.success('Course Details Updated');
      });
    })
  
    return mutation;
  }
  
  
  export const useUpdateInstructor = () => {
    const qc = useQueryClient();
    const mutation = useMutation(({id,data}:{id:string,data: Partial<Instructor>}): Promise<void> => {
      return UpdateInstructor(id, data).then(() => {
        qc.invalidateQueries([KEYS.GET_INSTRUCTORS]);
        message.success('Instructor Details Updated');
      })
    });
  
    return mutation;
  }
  

  // Learner 

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

  export const useGetCoursePlans = (id:string,options={enabled:true}) => {
    const { data = [] , isFetching: isLoading } =
      useQuery<Plan[]>([KEYS.GET_COURSE_PLANS, id], () => GetCoursePlans(id), options)
    return {
      data,
      isLoading
    }
  }

    
  export const useCreateCoursePlan = (cb:()=>void) => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,data}:{courseId:string, data: Plan}): Promise<void> => {
      return CreateCoursePlan(courseId, data).then(() => {
        qc.invalidateQueries([KEYS.GET_COURSE_PLANS]);
        message.success('Course Plan Added');
      })
    }, {
      onSuccess:()=>cb()
    });
  
    return mutation;
  }

  export const useUpdateCoursePlan = (cb: ()=>void) => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,planId,data}:{courseId:string,planId:string ,data: Plan}): Promise<void> => {
      return UpdateCoursePlan(courseId,planId, data).then(() => {
        qc.invalidateQueries([KEYS.GET_COURSE_PLANS]);
        message.success('Course Plan Updated');
      })
    }, {
      onSuccess:()=>cb()
    });
  
    return mutation;
  }