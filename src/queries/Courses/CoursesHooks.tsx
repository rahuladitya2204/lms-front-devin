import { CourseType, CreateCoursePayload } from '../../types/Courses.types'
import { CreateCourse, GetCourses } from './api'
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

export const useGetCourseDetails = () => {
  const { data = [], isFetching: isLoading } =
    useQuery<CourseType[]>([KEYS.GET_COURSE_DETAILS], GetCourses)
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
