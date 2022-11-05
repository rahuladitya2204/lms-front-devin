import {
  BookOutlined,
  CloudDownloadOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  YoutubeOutlined
} from '@ant-design/icons'
import {
  CourseNodeValueType,
  CourseSectionItem
} from '../../../../../types/Common.types'
import { Tooltip, Typography } from 'antd'

import React from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

interface CourseBuilderTreeNodePropsI {
  item: CourseSectionItem;
}

const Node = styled(Typography.Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: inline-block;
  width: 100%;
  padding: 6px;
  padding-bottom: 0;
  padding-top: 6px;
`

const CourseBuilderTreeNode: React.FC<CourseBuilderTreeNodePropsI> = props => {
  let icon
  const type = props.item.type
  let title: string | React.ReactNode = props.item.title

  const navigate = useNavigate()

  switch (type) {
    case 'chapter':
      icon = <BookOutlined />
      break
    case 'pdf':
      icon = <FilePdfOutlined />
      return (
        <Tooltip title={title}>
          <Node onClick={() => navigate(`${type}/${props.item.id}`)}>
            {icon} {title}
          </Node>
        </Tooltip>
      )

    case 'file':
      icon = <CloudDownloadOutlined />
      return (
        <Tooltip title={title}>
          <Node onClick={() => navigate(`${type}/${props.item.id}`)}>
            {icon} {title}
          </Node>
        </Tooltip>
      )

    case 'video':
      icon = <YoutubeOutlined />
      return (
        <Tooltip title={title}>
          <Node onClick={() => navigate(`${type}/${props.item.id}`)}>
            {icon} {title}
          </Node>
        </Tooltip>
      )

    case 'text':
      icon = <FileTextOutlined />
      return (
        <Node onClick={() => navigate(`${type}/${props.item.id}`)}>
          {icon} {title}
        </Node>
      )
  }
  return (
    <Node>
      {icon} {title}
    </Node>
  )
}

export default CourseBuilderTreeNode
