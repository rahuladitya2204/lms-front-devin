import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Course,
} from '@Types/Courses.types'
import { message } from 'antd'
import { GetCartItems, UpdateCartItems } from '.'
import { LEARNER_KEYS } from '../keys'


export const useGetCartItems = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Course[]>([LEARNER_KEYS.GET_CART_ITEMS], GetCartItems)
    return {
      data,
      isLoading
    }
  }
  

  export const useUpdateCartItems = () => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,action}:{courseId:string,action: string}): Promise<void> => {
      return UpdateCartItems({courseId,action}).then(() => {
        qc.invalidateQueries([LEARNER_KEYS.GET_CART_ITEMS]);
        message.success('Cart Updated');
      })
    });
  
    return mutation;
  }
  