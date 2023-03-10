import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'

import { Types } from '@adewaskar/lms-common'
import { findSectionItem } from '@User/Screens/Courses/CourseBuilder/utils'

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
