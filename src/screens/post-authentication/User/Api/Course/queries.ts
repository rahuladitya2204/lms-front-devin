import { Course, Plan, UpdateCoursePayload } from "@Types/Courses.types";
import { CreateCourse, CreateCoursePlan, GetCourseCategories, GetCourseDetails, GetCoursePlans, GetCourses, UpdateCourse, UpdateCoursePlan } from ".";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CourseCategory } from '../../../../../types/Courses.types';
import { INITIAL_COURSE_DETAILS } from "constant.ts";
import { KEYS } from "@Network/keys";
import { message } from "antd";

export const useGetCourses = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Course[]>([KEYS.GET_COURSES], GetCourses)
    return {
      data,
      isLoading
    }
  };
    
    export const useGetCourseDetails = (id:string,options={enabled:true}) => {
      const { data = INITIAL_COURSE_DETAILS , isFetching: isLoading } =
        useQuery<Course>([KEYS.GET_COURSE_DETAILS, id], () => GetCourseDetails(id), options)
      return {
        data,
        isLoading
      }
    }
    
    
    export const useCreateCourse = () => {
      const qc = useQueryClient();
      const mutation = useMutation((data: Partial<Course>) => {
        return CreateCourse(data).then(() => {
          qc.invalidateQueries([KEYS.GET_COURSES]);
          message.success('Course Details Updated');
        })
      });
    
      return mutation;
    }
    
    
    export const useUpdateCourse = () => {
      const qc = useQueryClient();
      const mutation = useMutation(({id,data,cb}:{id:string,data: Partial<UpdateCoursePayload>,cb?:(c:Course)=>void}) => {
        return UpdateCourse(id, data).then((response) => {
          qc.invalidateQueries([KEYS.GET_COURSE_DETAILS, id]);
          message.success('Course Details Updated');
          cb&&cb(response);
        })
      });
    
      return mutation;
    }

export const useGetCoursePlans = (id:string,options={enabled:true}) => {
    const { data = [] , isFetching: isLoading } =
      useQuery<Plan[]>([KEYS.GET_COURSE_PLANS, id], () => GetCoursePlans(id), options)
    return {
      data,
      isLoading
    }
  }

    
  export const useCreateCoursePlan = (cb:()=>void) => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,data}:{courseId:string, data: Plan}): Promise<void> => {
      return CreateCoursePlan(courseId, data).then(() => {
        qc.invalidateQueries([KEYS.GET_COURSE_PLANS]);
        message.success('Course Plan Added');
      })
    }, {
      onSuccess:()=>cb()
    });
  
    return mutation;
  }

  export const useUpdateCoursePlan = (cb: ()=>void) => {
    const qc = useQueryClient();
    const mutation = useMutation(({courseId,planId,data}:{courseId:string,planId:string ,data: Plan}): Promise<void> => {
      return UpdateCoursePlan(courseId,planId, data).then(() => {
        qc.invalidateQueries([KEYS.GET_COURSE_PLANS]);
        message.success('Course Plan Updated');
      })
    }, {
      onSuccess:()=>cb()
    });
  
    return mutation;
  }

  export const useGetCourseCategories = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<CourseCategory[]>([KEYS.GET_COURSE_CATEGORIES], GetCourseCategories)
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