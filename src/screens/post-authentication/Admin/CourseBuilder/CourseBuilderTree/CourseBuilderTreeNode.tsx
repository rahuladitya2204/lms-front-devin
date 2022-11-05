import {
  BookFilled,
  CloudDownloadOutlined,
  FilePdfFilled,
  FileTextFilled,
  PlayCircleFilled,
  YoutubeFilled
} from '@ant-design/icons'
import {
  CourseNodeValueType,
  CourseSectionItem
} from '../../../../../types/Common.types'
import React, { ReactNode } from 'react'
import { Tooltip, Typography } from 'antd'

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

const CourseBuilderTreeNode = (props: CourseBuilderTreeNodePropsI) => {
  let icon;
  switch (props.item.type) {
    case 'chapter':
      icon = <BookFilled />
      break
    case 'pdf':
      icon = <FilePdfFilled />
      break

    case 'file':
      icon = <CloudDownloadOutlined />
      break

    case 'video':
      icon = <PlayCircleFilled />
      break

    case 'text':
      icon = <FileTextFilled />
      break
  }
  return <>
    {icon}
  </>
}

export default CourseBuilderTreeNode
