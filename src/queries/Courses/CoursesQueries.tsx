import { CourseDetailsType, CourseType, CreateCoursePayload, UpdateCoursePayload } from '../../types/Courses.types'
import { CreateCourse, GetCourseDetails, GetCourses, UpdateCourse } from './api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { KEYS } from '../keys'
import { message } from 'antd'

export const useGetCourses = () => {
  const { data = [], isFetching: isLoading } =
    useQuery<CourseType[]>([KEYS.GET_COURSES], GetCourses)
  return {
    data,
    isLoading
  }
}

export const INITIAL_COURSE_DETAILS:CourseDetailsType = {
  title: '',
  subtitle:'',
  instructor: {name:'',image:''},
  instructorName:'',
  courseSections: [],
  _id: '',
  howToUse: '',
  whatYouLearn: [''],
  requirements:['']
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
  const qc = useQueryClient();
  const mutation = useMutation(({id,data}:{id:string,data: Partial<UpdateCoursePayload>}) => {
    return UpdateCourse(id, data).then(() => {
      qc.invalidateQueries([KEYS.GET_COURSE_DETAILS, id]);
      message.success('Course Details Updated');

    })
  });

  return mutation;
}
