import { KEYS } from "@Network/keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Course, CourseQuestion, CourseQuestionAnswer } from "@Types/Courses.types"
import { message } from "antd"
import { INITIAL_COURSE_DETAILS } from "constant.ts"
import { useNavigate } from "react-router"
import { createDiscussionQuestion, createDiscussionQuestionAnswer, enrollForCourse, GetCourseQuestions, getCoursesOfOrganisation, GetLearnerCourseDetails, GetLearnerCourses } from "."

export const useGetCourses = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Course[]>([KEYS.GET_COURSES], GetLearnerCourses)
    return {
      data,
      isLoading
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
        qc.invalidateQueries([KEYS.GET_COURSE_QUESTIONS,courseId]);
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
      return enrollForCourse(courseId).then(() => {
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
      useQuery<CourseQuestion[]>([KEYS.GET_COURSE_QUESTIONS,courseId], ()=>GetCourseQuestions(courseId))
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