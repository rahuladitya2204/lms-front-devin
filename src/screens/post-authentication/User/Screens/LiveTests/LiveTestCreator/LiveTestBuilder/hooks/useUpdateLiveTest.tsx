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
  let { itemId, id: testId } = useParams()
  const { data: liveTest } = User.Queries.useGetLiveTestDetails(testId + '', {
    enabled: !!testId
  })
  const items = sections.map(s => s.items).flat()
  const item = findSectionItem(itemId + '' + '', items)
  const currentItemIndex = item ? items.findIndex(i => i._id === item._id) : -1

  useEffect(
    () => {
      if (form) {
        form.setFieldsValue(item)
      }
    },
    [item]
  )

  return { form, item, testId, itemId, currentItemIndex }
}

export default useUpdateLiveTestForm
