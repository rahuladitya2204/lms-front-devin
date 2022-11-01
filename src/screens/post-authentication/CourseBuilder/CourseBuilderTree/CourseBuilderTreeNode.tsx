import { BookOutlined, FilePdfOutlined } from '@ant-design/icons'

import AddItem from '../AddItem'
import { CourseNodeValueType } from '../../../../types/Common.types'
import type { DataNode } from 'antd/es/tree'
import React from 'react'
import { Tooltip } from 'antd'
import styled from '@emotion/styled'
import { useNavigateParams } from '../../../../hooks/CommonHooks'

interface CourseBuilderTreeNodePropsI {
  data: DataNode;
  onAddNewItem: (type: string, value: CourseNodeValueType, key: string) => void;
}

const Node = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: inline-block;
`

const CourseBuilderTreeNode: React.FC<CourseBuilderTreeNodePropsI> = props => {
  let icon
  const keyData = JSON.parse('' + props.data.key)
  const type = keyData.type
  let title: string | React.ReactNode = `${props.data.title}`

  const navigate = useNavigateParams()
  // console.log(type, 'type')
  switch (type) {
    case 'chapter':
      icon = <BookOutlined />
      break
    case 'pdf':
      icon = <FilePdfOutlined />
      return (
        <Tooltip title={title}>
          <Node
            onClick={() =>
              navigate(type, {
                nodeId: keyData.id
              })
            }
          >
            {icon} {title}
          </Node>
        </Tooltip>
      )

    case 'text':
      icon = <FilePdfOutlined />
      return (
        <Node
          onClick={() =>
            navigate(type, {
              nodeId: keyData.id
            })
          }
        >
          {icon} {title}
        </Node>
      )

    case 'item':
      title = (
        <AddItem
          onAddNewItem={(key, value) =>
            props.onAddNewItem(key, value, keyData.id)
          }
        >
          {' '}
          {title}
        </AddItem>
      )
      break
  }
  return (
    <Node>
      {icon} {title}
    </Node>
  )
}

export default CourseBuilderTreeNode
