import { Constants, Network, Types } from '@adewaskar/lms-common'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { LEARNER_KEYS } from "../keys"
import {Learner} from '@adewaskar/lms-common'
import { calcCourseProgress } from "./utils"
import { message } from "antd"
import { useNavigate } from "react-router"

export const useGetEnrolledCourses = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.EnrolledCourseDetails[]>([Network.KEYS.GET_ENROLLED_COURSES], () => Learner.Api.GetLearnerEnrolledCourses().then((enrolledCourses => {
        const hydrated = enrolledCourses.map(i => calcCourseProgress(i));
        return hydrated;
      })))
    return {
      data,
      isLoading
    }
  }
  
  
  
  export const useGetCourseDetails = (id:string,options={enabled:true}) => {
    const { data = Constants.INITIAL_COURSE_DETAILS , isFetching: isLoading } =
      useQuery<Types.Course>([Network.KEYS.GET_COURSE_DETAILS, id], () => Learner.Api.GetLearnerCourseDetails(id), options)
    return {
      data,
      isLoading
    }
  }


  export const useGetEnrolledCourseDetails = (id:string,options={enabled:true}) => {
    const { data = Constants.INITIAL_ENROLLED_COURSE_DETAILS, isFetching: isLoading } =
      useQuery<Types.EnrolledCourseDetails>([LEARNER_KEYS.GET_ENROLLED_COURSE_DETAILS, id], () => Learner.Api.GetEnrolledCourseDetails(id).then(({ completed, course }) => {
        const calculatedProgress = calcCourseProgress({course, completed});
        return {course:calculatedProgress.course,progress:calculatedProgress.progress,completed};
      }), {
        notifyOnChangeProps:['data']
      });
    return {
      data:data,
      isLoading
    }
  }

  export const useCreateDiscussionQuestion = (onSuccess:()=>void) => {
    const qc = useQueryClient();
    const mutation = useMutation(({id,data}:{id:string,data: Partial<Types.CourseQuestion>}): Promise<void> => {
      return Learner.Api.createDiscussionQuestion(id, data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_COURSE_QUESTIONS]);
        message.success('Query Posted');
      })
    }, {
      onSuccess:()=>onSuccess()
    });
  
    return mutation;
  }
  
  export const useUpdateCourseProgress = () => {
    const qc = useQueryClient();
    const mutation = useMutation((data: { courseId: string, itemId: string;  action: string}): Promise<void> => {
      return Learner.Api.UpdateCourseProgress(data)
        .then(() => {
        // qc.invalidateQueries([LEARNER_Network.KEYS.GET_ENROLLED_COURSE_DETAILS]);
        message.success('Progress Updated');
      })
    });
  
    return mutation;
  }
  

  export const useCreateDiscussionQuestionAnswer = (onSuccess:()=>void) => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,questionId,data}:{courseId:string,questionId:string,data: Partial<Types.CourseQuestionAnswer>}): Promise<void> => {
      return Learner.Api.createDiscussionQuestionAnswer(courseId,questionId, data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_COURSE_QUESTIONS,courseId]);
        message.success('Answer Posted');
      })
    }, {
      onSuccess:()=>onSuccess()
    });
    return mutation;
  }
  
  
  export const useEnrollForCourse = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();
  
    const mutation = useMutation((courseId:string): Promise<void> => {
      return Learner.Api.enrollForCourse(courseId).then(() => {
        message.success('Enrolled for the course. Congratulation!');
      })
    }, {
      onSuccess: () => {
        navigate('enrolled')
      }
    });
    return mutation;
  }

  export const useGetCourseQuestions = (courseId:string) => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.CourseQuestion[]>([Network.KEYS.GET_COURSE_QUESTIONS,courseId], ()=>Learner.Api.GetCourseQuestions(courseId))
    return {
      data,
      isLoading
    }
  }
  
  export const useGetCoursesOfOrganisation = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.Course[]>([Network.KEYS.GET_COURSES_OF_ORGANISATION], ()=>Learner.Api.getCoursesOfOrganisation())
    return {
      data,
      isLoading
    }
  }