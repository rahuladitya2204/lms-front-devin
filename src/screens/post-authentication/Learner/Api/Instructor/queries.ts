import { KEYS } from "@Network/keys"
import { useQuery } from "@tanstack/react-query"
import { Instructor } from "@Types/Instructor.types"
import { getInstructors } from "."

export const useGetInstructors = () => {
    const { data = [], isFetching: isLoading } =
      useQuery<Instructor[]>([KEYS.GET_INSTRUCTORS], getInstructors)
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