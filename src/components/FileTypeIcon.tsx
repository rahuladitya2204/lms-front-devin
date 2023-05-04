import {
  FileImageOutlined,
  FilePdfFilled,
  FilePdfOutlined,
  PlayCircleFilled,
  PlayCircleOutlined
} from '@ant-design/icons'

import { Fragment } from 'react'

interface CourseItemIconPropsI {
  fileType: string;
  iconType?: string;
  onClick?: Function;
}

const FileTypeIcon = (props: CourseItemIconPropsI) => {
  let Icon: React.FC = PlayCircleOutlined
  switch (props.fileType) {
    case 'pdf':
      if (props.iconType === 'outlined') {
        Icon = FilePdfOutlined
      } else {
        Icon = FilePdfFilled
      }
      break

    case 'image':
      if (props.iconType === 'outlined') {
        Icon = FileImageOutlined
      } else {
        Icon = FileImageOutlined
      }
      break

    case 'video':
      if (props.iconType === 'outlined') {
        Icon = PlayCircleOutlined
      } else {
        Icon = PlayCircleFilled
      }
      break
  }
  return (
    <Fragment>
      {/* @ts-ignore */}
      <Icon onClick={props.onClick} style={{ fontSize: 30, marginRight: 10 }} />
    </Fragment>
  )
}

export default FileTypeIcon
