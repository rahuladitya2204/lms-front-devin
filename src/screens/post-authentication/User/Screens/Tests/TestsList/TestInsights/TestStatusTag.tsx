import { Enum, Types } from '@invinciblezealorg/lms-common'

import { Tag } from 'antd'
import { useMemo } from 'react'

interface TestStatusTagPropsI {
  ep: Types.EnrolledProductDetails;
}
export default function TestStatusTag({ ep }: TestStatusTagPropsI) {
  if (ep.metadata.test.startedAt) {
    if (ep.metadata.test.endedAt) {
      return <Tag color="green-inverse">Submitted</Tag>
    } else {
      return <Tag color="orange">In Progress</Tag>
    }
  } else {
    return <Tag color="blue-inverse">Not Started Yet</Tag>
  }
  return null
}
