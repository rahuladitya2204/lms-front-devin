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

import { CourseSectionItem } from '../../../../../../types/Common.types'
import { Fragment } from 'react'

interface CourseItemIconPropsI {
  item: CourseSectionItem;
  type?: string;
}

const CourseItemIcon = (props: CourseItemIconPropsI) => {
  let icon
  switch (props.item.type) {
    case 'chapter':
      if (props.type === 'outlined') {
        icon = <BookOutlined />
      } else {
        icon = <BookFilled />
      }

      break
    case 'pdf':
      if (props.type === 'outlined') {
        icon = <FilePdfOutlined />
      } else {
        icon = <FilePdfFilled />
      }
      break

    case 'file':
      if (props.type === 'outlined') {
        icon = <CloudDownloadOutlined />
      } else {
        icon = <CloudDownloadOutlined />
      }
      break

    case 'video':
      if (props.type === 'outlined') {
        icon = <PlayCircleOutlined />
      } else {
        icon = <PlayCircleFilled />
      }
      break

    case 'text':
      if (props.type === 'outlined') {
        icon = <FileTextOutlined />
      } else {
        icon = <FileTextFilled />
      }
      break
  }
  return <Fragment>{icon}</Fragment>
}

export default CourseItemIcon
