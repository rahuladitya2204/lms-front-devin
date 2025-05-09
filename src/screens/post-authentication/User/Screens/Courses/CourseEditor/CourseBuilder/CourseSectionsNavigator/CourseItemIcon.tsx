import {
  BookFilled,
  BookOutlined,
  CloudDownloadOutlined,
  EditFilled,
  EditOutlined,
  FilePdfFilled,
  FilePdfOutlined,
  FileTextFilled,
  FileTextOutlined,
  FileWordFilled,
  FileWordOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  QuestionCircleFilled
} from '@ant-design/icons'

import { Fragment } from 'react'
import { Types } from '@adewaskar/lms-common'

interface CourseItemIconPropsI {
  item: Types.CourseSectionItem;
  type?: string;
  style?: any;
}

const CourseItemIcon = (props: CourseItemIconPropsI) => {
  let Icon: any
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

    case 'quiz':
      if (props.type === 'outlined') {
        Icon = EditOutlined
      } else {
        Icon = EditFilled
      }
      break

    case 'text':
      if (props.type === 'outlined') {
        Icon = FileTextOutlined
      } else {
        Icon = FileTextFilled
      }
      break

    default:
      Icon = QuestionCircleFilled
  }
  return (
    <Fragment>
      {/* @ts-ignore */}
      {Icon ? (
        <Icon style={{ fontSize: 12, ...(props.style ? props.style : {}) }} />
      ) : null}
    </Fragment>
  )
}

export default CourseItemIcon
