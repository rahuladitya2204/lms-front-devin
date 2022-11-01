import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'

import { CourseTreeTypeNode } from '../types/Common.types';
import { findNode } from '../screens/post-authentication/Admin/CourseBuilder/utils'

export const useNavigateParams = () => {
  const navigate = useNavigate()

  return (url: string, params: Record<string, string | string[]>) => {
    const searchParams = createSearchParams(params).toString()
    navigate(url + '?' + searchParams)
  }
}

export const useGetNodeFromRouterOutlet = () => {
  const { nodeId } = useParams();
  console.log(nodeId,'nodeIdnodeId')
  const [courseTree] = useOutletContext<CourseTreeTypeNode[][]>()
  const node = findNode(nodeId+'', courseTree);

  return node;
}
