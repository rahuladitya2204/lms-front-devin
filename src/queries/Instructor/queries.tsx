import { CreateInstructor, GetInstructorDetails, GetInstructors, UpdateInstructor } from './api'
import { CreateInstructorPayload, InstructorDetailsType, InstructorType } from '../../types/Instructor.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { KEYS } from '../keys'
import { message } from 'antd'

export const useGetInstructors = () => {
  const { data = [], isFetching: isLoading } =
    useQuery<InstructorDetailsType[]>([KEYS.GET_INSTRUCTORS], GetInstructors)
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

export const INITIAL_INSTRUCTOR_DETAILS:InstructorDetailsType = {
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

export const useGetInstructorDetails = (id:string,options={enabled:true}) => {
  const { data = INITIAL_INSTRUCTOR_DETAILS , isFetching: isLoading } =
    useQuery<InstructorDetailsType>([KEYS.GET_INSTRUCTOR_DETAILS, id], () => GetInstructorDetails(id), options)
  return {
    data,
    isLoading
  }
}


export const useCreateInstructor = () => {
  const qc = useQueryClient();
  const mutation = useMutation((data: CreateInstructorPayload) => {
    return CreateInstructor(data).then((data) => {
      qc.invalidateQueries([KEYS.GET_INSTRUCTORS]);
      message.success('Course Details Updated');
    });
  })

  return mutation;
}


export const useUpdateInstructor = () => {
  const qc = useQueryClient();
  const mutation = useMutation(({id,data}:{id:string,data: Partial<InstructorDetailsType>}): Promise<void> => {
    return UpdateInstructor(id, data).then(() => {
      qc.invalidateQueries([KEYS.GET_INSTRUCTOR_DETAILS, id]);
      message.success('Instructor Details Updated');
    })
  });

  return mutation;
}
