import {
  BookFilled,
  BookOutlined,
  CloudDownloadOutlined,
  FilePdfFilled,
  FilePdfOutlined,
  FileTextFilled,
  FileTextOutlined,
  PlayCircleFilled,
  PlayCircleOutlined
} from '@ant-design/icons'

import { Fragment, ReactNode } from 'react'
import { CourseSectionItem } from '@Types/Courses.types'

interface CourseItemIconPropsI {
  item: CourseSectionItem;
  type?: string;
}

const CourseItemIcon = (props: CourseItemIconPropsI) => {
  let Icon: React.FC
  switch (props.item.type) {
    case 'chapter':
      if (props.type === 'outlined') {
        Icon = BookOutlined
      } else {
        Icon = BookFilled
      }

      break
    case 'pdf':
      if (props.type === 'outlined') {
        Icon = FilePdfOutlined
      } else {
        Icon = FilePdfFilled
      }
      break

    case 'file':
      if (props.type === 'outlined') {
        Icon = CloudDownloadOutlined
      } else {
        Icon = CloudDownloadOutlined
      }
      break

    case 'video':
      if (props.type === 'outlined') {
        Icon = PlayCircleOutlined
      } else {
        Icon = PlayCircleFilled
      }
      break

    case 'text':
      if (props.type === 'outlined') {
        Icon = FileTextOutlined
      } else {
        Icon = FileTextFilled
      }
      break
  }
  return (
    <Fragment>
      {/* @ts-ignore */}
      <Icon style={{ fontSize: 18 }} />
    </Fragment>
  )
}

export default CourseItemIcon
