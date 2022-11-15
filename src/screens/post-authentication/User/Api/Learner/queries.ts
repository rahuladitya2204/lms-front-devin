import { KEYS } from "@Network/keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateLearnerPayload, Learner } from "@Types/Learner.types"
import { CreateLearner, GetLearnerDetails, GetLearners, UpdateLearner } from "."
import { message } from 'antd';
import { INITIAL_LEARNER_DETAILS } from "constant.ts";

export const useGetLearners = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Learner[]>([KEYS.GET_LEARNERS], GetLearners)
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
      useQuery<Learner>([KEYS.GET_LEARNER_DETAILS, id], () => GetLearnerDetails(id), options)
    return {
      data,
      isLoading
    }
  }
  
  
  export const useCreateLearner = () => {
    const qc = useQueryClient();
    const mutation = useMutation((data: CreateLearnerPayload) => {
      return CreateLearner(data).then((data) => {
        qc.invalidateQueries([KEYS.GET_LEARNERS]);
        message.success('Learners Details Updated');
      });
    })
  
    return mutation;
  }
  
  
  export const useUpdateLearner = () => {
    const qc = useQueryClient();
    const mutation = useMutation(({id,data}:{id:string,data: Partial<Learner>}): Promise<void> => {
      return UpdateLearner(id, data).then(() => {
        qc.invalidateQueries([KEYS.GET_LEARNERS]);
        message.success('Learner Details Updated');
      })
    });
  
    return mutation;
  }
