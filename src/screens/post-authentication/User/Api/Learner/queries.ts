import { CreateLearner, GetLearnerDetails, GetLearners, UpdateLearner } from "."
import {Network, Types} from '@adewaskar/lms-common'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { INITIAL_LEARNER_DETAILS } from "constant.ts";
import { message } from 'antd';

export const useGetLearners = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.Learner[]>([Network.KEYS.GET_LEARNERS], GetLearners)
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
  
  export const useGetLearnerDetails = (id:string,options={enabled:true}) => {
    const { data = INITIAL_LEARNER_DETAILS , isFetching: isLoading } =
      useQuery<Types.Learner>([Network.KEYS.GET_LEARNER_DETAILS, id], () => GetLearnerDetails(id), options)
    return {
      data,
      isLoading
    }
  }
  
  
  export const useCreateLearner = () => {
    const qc = useQueryClient();
    const mutation = useMutation((data: Types.CreateLearnerPayload) => {
      return CreateLearner(data).then((data) => {
        qc.invalidateQueries([Network.KEYS.GET_LEARNERS]);
        message.success('Learners Details Updated');
      });
    })
  
    return mutation;
  }
  
  
  export const useUpdateLearner = () => {
    const qc = useQueryClient();
    const mutation = useMutation(({id,data}:{id:string,data: Partial<Types.Learner>}): Promise<void> => {
      return UpdateLearner(id, data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_LEARNERS]);
        message.success('Learner Details Updated');
      })
    });
  
    return mutation;
  }
