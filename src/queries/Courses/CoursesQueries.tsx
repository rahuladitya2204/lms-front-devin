import { CourseDetailsType, CourseType, CreateCoursePayload, UpdateCoursePayload } from '../../types/Courses.types'
import { CreateCourse, GetCourseDetails, GetCourses, UpdateCourse } from './api'
import { useMutation, useQuery } from '@tanstack/react-query'

import { KEYS } from '../keys'

export const useGetCourses = () => {
  const { data = [], isFetching: isLoading } =
    useQuery<CourseType[]>([KEYS.GET_COURSES], GetCourses)
  return {
    data,
    isLoading
  }
}

const INITIAL_COURSE_DETAILS:CourseDetailsType = {
  title: '',
  instructorName: '',
  courseTree: [],
  _id: '',
  howToUse:''
}

export const useGetCourseDetails = (id:string,options={enabled:true}) => {
  const { data = INITIAL_COURSE_DETAILS , isFetching: isLoading } =
    useQuery<CourseDetailsType>([KEYS.GET_COURSE_DETAILS, id], () => GetCourseDetails(id), options)
  return {
    data,
    isLoading
  }
}


export const useCreateCourse = () => {
  const mutation = useMutation((data: CreateCoursePayload) => {
    return CreateCourse(data)
  });

  return mutation;
}


export const useUpdateCourse = () => {
  const mutation = useMutation(({id,data}:{id:string,data: Partial<UpdateCoursePayload>}) => {
    return UpdateCourse(id,data)
  });

  return mutation;
}
