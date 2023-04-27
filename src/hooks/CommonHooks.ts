import { Common, Store, Types } from '@adewaskar/lms-common'
import {
  createSearchParams,
  useNavigate,
  useOutletContext,
  useParams
} from 'react-router-dom'
import { useEffect, useState } from 'react'

import { findSectionItem } from '@User/Screens/Courses/CourseBuilder/utils'
import { getToken } from '@Network/index'

export const useNavigateParams = () => {
  const navigate = useNavigate()

  return (url: string, params: Record<string, string | string[]>) => {
    const searchParams = createSearchParams(params).toString()
    navigate(url + '?' + searchParams)
  }
}

export const useGetNodeFromRouterOutlet = () => {
  const { itemId,sectionId } = useParams();
  const [sections, courseId] = useOutletContext<Types.CourseSection[][]>();
  const node: Types.CourseSectionItem = findSectionItem(itemId + '', sectionId + '', sections) || {};
  return { node, courseId };
}

export const useAppInit = (type: string) => {
  const token = getToken();
  const { fetchOrganisation } = Store.useGlobal();
  const [loading, setLoading] = useState(false);
  const {
    mutate: validateUser,
  } = Common.Queries.useValidateUser()

  useEffect(() => {
    initApp();
  }, [type,token]);


  const initApp = async () => {
    try {
      setLoading(true);
      await fetchOrganisation();
      if (token) {
        await validateUser({
          type: type,
          onSuccess: () => { }
        });
      }
    }
    catch (er) {
      setLoading(false)
    }
  }


  return { isInitDone: loading }
}
