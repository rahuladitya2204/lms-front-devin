import { BookOutlined, FilePdfOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import type { DataNode, TreeProps } from 'antd/es/tree'
import React, { useState } from 'react'

import AddItem from '../AddItem'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'
import { useNavigateParams } from '../../../../hooks/CommonHooks'

interface CourseBuilderTreeNodePropsI {
  data: DataNode;
  onAddNewItem: (type: string, value: string, key: string) => void;
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

  switch (type) {
    case 'chapter':
      icon = <BookOutlined />
      break
    case 'pdf':
      icon = <FilePdfOutlined />
      return <Tooltip title={title}>
        <Node
          onClick={() =>
            navigate(type, {
              value: keyData.value
            })
          }
        >
          {icon} {title}
        </Node>
      </Tooltip>;
    
    case 'item':
      title = (
        <AddItem
          onAddNewItem={(key, value) =>
            props.onAddNewItem(key, value, props.data.key + '')
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
