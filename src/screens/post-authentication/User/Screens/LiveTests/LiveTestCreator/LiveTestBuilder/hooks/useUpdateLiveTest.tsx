import { Types, User } from '@adewaskar/lms-common'
import { useOutletContext, useParams } from 'react-router'

import { Form } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import { findSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useEffect } from 'react'

function useUpdateLiveTestForm(
  sections: Types.LiveTestSection[],
  form?: FormInstance
) {
  let { itemId, sectionId, id: testId } = useParams()
  const { data: liveTest } = User.Queries.useGetLiveTestDetails(testId + '', {
    enabled: !!testId
  })
  const section = liveTest.sections.find(s => s._id === sectionId)

  const item = findSectionItem(itemId + '', sectionId + '', sections)
  const currentItemIndex = item
    ? section?.items.findIndex(i => i._id === item._id)
    : -1

  useEffect(
    () => {
      if (form) {
        form.setFieldsValue(item)
      }
    },
    [item]
  )

  return { form, item, sectionId, testId, itemId, section, currentItemIndex }
}

export default useUpdateLiveTestForm
