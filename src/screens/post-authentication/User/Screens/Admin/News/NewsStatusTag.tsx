import { Enum, Types } from '@adewaskar/lms-common'

import { SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd'
import { useMemo } from 'react'

interface NewsStatusTagPropsI {
  status: Enum.NewsStatus;
}
export default function NewsStatusTag(props: NewsStatusTagPropsI) {
  if (props.status === Enum.NewsStatus.FAILED) {
    return <Tag color="red-inverse">Failed</Tag>
  }
  if (props.status === Enum.NewsStatus.IN_PROGRESS) {
    return (
      <Tag icon={<SyncOutlined spin />} color="blue-inverse">
        In Progress
      </Tag>
    )
  }
  if (props.status === Enum.NewsStatus.SUCCESS) {
    return <Tag color="green-inverse">Success</Tag>
  }
  return 'Not Found'
}
