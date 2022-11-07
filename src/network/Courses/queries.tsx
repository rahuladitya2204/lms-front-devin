import { CourseDetailType, CourseType, UpdateCoursePayload } from '../../types/Courses.types'
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

export const INITIAL_COURSE_DETAILS:CourseDetailType = {
  title: '',
  subtitle: '',
  description:'',
  instructor: '',
  courseSections: [],
  thumbnailImage:'',
  _id: '',
  howToUse: '',
  whatYouLearn: [''],
  requirements:['']
}

export const useGetCourseDetails = (id:string,options={enabled:true}) => {
  const { data = INITIAL_COURSE_DETAILS , isFetching: isLoading } =
    useQuery<CourseDetailType>([KEYS.GET_COURSE_DETAILS, id], () => GetCourseDetails(id), options)
  return {
    data,
    isLoading
  }
}


export const useCreateCourse = () => {
  const qc = useQueryClient();
  const mutation = useMutation((data: Partial<CourseDetailType>) => {
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
