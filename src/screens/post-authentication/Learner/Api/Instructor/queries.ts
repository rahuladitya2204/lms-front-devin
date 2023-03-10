import { Network, Types } from '@adewaskar/lms-common'

import {Learner} from '@adewaskar/lms-common'
import { useQuery } from "@tanstack/react-query"

export const useGetInstructors = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.Instructor[]>([Network.KEYS.GET_INSTRUCTORS], Learner.Api.getInstructors)
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