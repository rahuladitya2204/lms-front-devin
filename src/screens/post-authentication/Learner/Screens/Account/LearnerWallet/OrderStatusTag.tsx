import { Enum } from '@adewaskar/lms-common'
import { Tag } from 'antd'
import { useMemo } from 'react'

interface OrderStatusTagPropsI {
  status: Enum.OrderStatus;
}

export function OrderStatusTag(props: OrderStatusTagPropsI) {
  const StatusTag = useMemo(
    () => {
      switch (props.status) {
        case Enum.OrderStatus.PENDING: {
          return <Tag color="orange">Pending</Tag>
        }

        case Enum.OrderStatus.SUCCESSFUL: {
          return <Tag color="green">Successful</Tag>
        }

        case Enum.OrderStatus.FAILED: {
          return <Tag color="red">Failed</Tag>
        }
      }
    },
    [props.status]
  )
  return StatusTag
}
