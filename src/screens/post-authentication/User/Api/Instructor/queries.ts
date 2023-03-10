import { Network, Types } from '@adewaskar/lms-common'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { INITIAL_INSTRUCTOR_DETAILS } from "constant.ts"
import { User } from '@adewaskar/lms-common'
import { message } from "antd"

export const useGetInstructors = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.Instructor[]>([Network.KEYS.GET_INSTRUCTORS],User.Api.GetInstructors)
    return {
      data,
      isLoading,
      listItems: data.map(i => {
        return {
          value: i._id,
          label: i.name
        }
      })
    }
  }
  
  export const useGetInstructorDetails = (id:string,options={enabled:true}) => {
    const { data = INITIAL_INSTRUCTOR_DETAILS , isFetching: isLoading } =
      useQuery<Types.Instructor>([Network.KEYS.GET_INSTRUCTOR_DETAILS, id], () => User.Api.GetInstructorDetails(id), options)
    return {
      data,
      isLoading
    }
  }
  

  
  export const useCreateInstructor = () => {
    const qc = useQueryClient();
    const mutation = useMutation((data: Types.CreateInstructorPayload) => {
      return User.Api.CreateInstructor(data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_INSTRUCTORS]);
        message.success('Course Details Updated');
      });
    })
  
    return mutation;
  }
  
  
  export const useUpdateInstructor = () => {
    const qc = useQueryClient();
    const mutation = useMutation(({id,data}:{id:string,data: Partial<Types.Instructor>}): Promise<void> => {
      return User.Api.UpdateInstructor(id, data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_INSTRUCTORS]);
        message.success('Instructor Details Updated');
      })
    });
  
    return mutation;
  }
