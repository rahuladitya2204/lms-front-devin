import { Common, Store, Types } from '@adewaskar/lms-common'
import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'

import { findSectionItem } from '@User/Screens/Courses/CourseBuilder/utils'
import { useEffect } from 'react'

export const useNavigateParams = () => {
  const navigate = useNavigate()

  return (url: string, params: Record<string, string | string[]>) => {
    const searchParams = createSearchParams(params).toString()
    navigate(url + '?' + searchParams)
  }
}

export const useGetNodeFromRouterOutlet = () => {
  const { itemId,sectionId } = useParams();
  const [sections] = useOutletContext<Types.CourseSection[][]>()
  const node: Types.CourseSectionItem = findSectionItem(itemId + '', sectionId + '', sections) || {};
  return node;
}

export const useAppInit = (type:string) => {
  const navigate = useNavigate();
  const {organisation } = Store.useGlobal();
  const {
    mutate: validateUser,
    isLoading: validatingUser,
  } = Common.Queries.useValidateUser()

  useEffect(() => {
    validateUser({
      type: type, onSuccess: () => {
        if (type === 'learner') {
          return navigate(`/learner/${organisation._id}/login`)
        }
        navigate(`/user/login`)
    } })
  }, []);

  const isInitDone = validatingUser

  return { isInitDone }
}
