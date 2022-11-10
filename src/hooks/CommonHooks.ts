import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'
import { findSectionItem } from '@User/Screens/Courses/CourseBuilder/utils'

import { CourseSection, CourseSectionItem } from '@Types/Courses.types'

export const useNavigateParams = () => {
  const navigate = useNavigate()

  return (url: string, params: Record<string, string | string[]>) => {
    const searchParams = createSearchParams(params).toString()
    navigate(url + '?' + searchParams)
  }
}

export const useGetNodeFromRouterOutlet = () => {
  const { itemId,sectionId } = useParams();
  const [sections] = useOutletContext<CourseSection[][]>()
  const node: CourseSectionItem = findSectionItem(itemId + '', sectionId + '', sections) || {};
  return node;
}
