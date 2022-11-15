import { KEYS } from "@Network/keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Course, Plan, UpdateCoursePayload } from "@Types/Courses.types";
import { message } from "antd";
import { INITIAL_COURSE_DETAILS } from "constant.ts";
import { CreateCourse, CreateCoursePlan, GetCourseDetails, GetCoursePlans, GetCourses, UpdateCourse, UpdateCoursePlan } from ".";



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
      const mutation = useMutation(({id,data}:{id:string,data: Partial<UpdateCoursePayload>}) => {
        return UpdateCourse(id, data).then(() => {
          qc.invalidateQueries([KEYS.GET_COURSE_DETAILS, id]);
          message.success('Course Details Updated');
    
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