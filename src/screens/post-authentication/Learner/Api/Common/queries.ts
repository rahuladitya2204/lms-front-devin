import { Learner, Types } from '@adewaskar/lms-common'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { LEARNER_KEYS } from '../keys'
import { message } from 'antd'

export const useGetCartItems = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.Course[]>([LEARNER_KEYS.GET_CART_ITEMS], Learner.Api.GetCartItems)
    return {
      data,
      isLoading
    }
  }
  

  export const useUpdateCartItems = () => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,action}:{courseId:string,action: string}): Promise<void> => {
      return Learner.Api.UpdateCartItems({courseId,action}).then(() => {
        qc.invalidateQueries([LEARNER_KEYS.GET_CART_ITEMS]);
        message.success('Cart Updated');
      })
    });
  
    return mutation;
  }
  