import { Enum, Types } from '@adewaskar/lms-common'

import { Tag } from 'antd'
import { useMemo } from 'react'

interface TestStatusTagPropsI {
  test: Types.Test;
}
export default function TestStatusTag({ test }: TestStatusTagPropsI) {
  if (test.status === Enum.TestStatus.PUBLISHED) {
    return <Tag color="green-inverse">Published</Tag>
  }

  if (test.status === Enum.TestStatus.DRAFT) {
    return <Tag color="blue-inverse">Draft</Tag>
  }

  if (test.status === Enum.TestStatus.ENDED) {
    return <Tag color="red">Ended</Tag>
  }

  //   if (test.status === Enum.TestStatus.IN_PROGRESS) {
  //     return <Tag color="green-inverse">Submitted</Tag>
  //   }

  return `-`
}
