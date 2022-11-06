import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'

import { CourseSectionItem } from '../types/Common.types';
import { findNode } from '../screens/post-authentication/Admin/Courses/CourseBuilder/utils'

export const useNavigateParams = () => {
  const navigate = useNavigate()

  return (url: string, params: Record<string, string | string[]>) => {
    const searchParams = createSearchParams(params).toString()
    navigate(url + '?' + searchParams)
  }
}

export const useGetNodeFromRouterOutlet = () => {
  const { nodeId } = useParams();
  const [courseSections] = useOutletContext<CourseSectionItem[][]>()
  const node: CourseSectionItem = findNode(nodeId+'', courseSections);

  return node;
}
