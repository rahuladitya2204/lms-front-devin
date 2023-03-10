import {Constants, User} from '@adewaskar/lms-common'
import { Network, Types } from '@adewaskar/lms-common'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { message } from "antd";

export const useGetCourses = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.Course[]>([Network.KEYS.GET_COURSES], User.Api.GetCourses)
    return {
      data,
      isLoading
    }
  };
    
    export const useGetCourseDetails = (id:string,options={enabled:true}) => {
      const { data = Constants.INITIAL_COURSE_DETAILS , isFetching: isLoading } =
        useQuery<Types.Course>([Network.KEYS.GET_COURSE_DETAILS, id], () => User.Api.GetCourseDetails(id), options)
      return {
        data,
        isLoading
      }
    }
    
    
    export const useCreateCourse = () => {
      const qc = useQueryClient();
      const mutation = useMutation((data: Partial<Types.Course>) => {
        return User.Api.CreateCourse(data).then(() => {
          qc.invalidateQueries([Network.KEYS.GET_COURSES]);
          message.success('Course Details Updated');
        })
      });
    
      return mutation;
    }
    
    
    export const useUpdateCourse = () => {
      const qc = useQueryClient();
      const mutation = useMutation(({id,data,cb}:{id:string,data: Partial<Types.UpdateCoursePayload>,cb?:(c:Types.Course)=>void}) => {
        return User.Api.UpdateCourse(id, data).then((response) => {
          qc.invalidateQueries([Network.KEYS.GET_COURSE_DETAILS, id]);
          message.success('Course Details Updated');
          cb&&cb(response);
        })
      });
    
      return mutation;
    }

export const useGetCoursePlans = (id:string,options={enabled:true}) => {
    const { data = [] , isFetching: isLoading } =
      useQuery<Types.Plan[]>([Network.KEYS.GET_COURSE_PLANS, id], () => User.Api.GetCoursePlans(id), options)
    return {
      data,
      isLoading
    }
  }

    
  export const useCreateCoursePlan = (cb:()=>void) => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,data}:{courseId:string, data: Types.Plan}): Promise<void> => {
      return User.Api.CreateCoursePlan(courseId, data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_COURSE_PLANS]);
        message.success('Course Plan Added');
      })
    }, {
      onSuccess:()=>cb()
    });
  
    return mutation;
  }

  export const useUpdateCoursePlan = (cb: ()=>void) => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,planId,data}:{courseId:string,planId:string ,data: Types.Plan}): Promise<void> => {
      return User.Api.UpdateCoursePlan(courseId,planId, data).then(() => {
        qc.invalidateQueries([Network.KEYS.GET_COURSE_PLANS]);
        message.success('Course Plan Updated');
      })
    }, {
      onSuccess:()=>cb()
    });
  
    return mutation;
  }

  export const useGetCourseCategories = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Types.CourseCategory[]>([Network.KEYS.GET_COURSE_CATEGORIES], User.Api.GetCourseCategories)
    return {
      data,
      isLoading,
      listItems: data.map(i => {
        return {
          value: i._id,
          label: i.title
        }
      })
    }
  }