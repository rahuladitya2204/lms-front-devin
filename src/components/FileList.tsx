import { Avatar, Modal } from 'antd'
import { Fragment, useState } from 'react'

import { FileOutlined } from '@ant-design/icons'
import { Types } from '@adewaskar/lms-common'

interface FileListPropsI {
  files: Types.UploadFileType[];
}

function FileList(props: FileListPropsI) {
  return (
    <Fragment>
      {props.files?.map(file => {
        return (
          <Avatar
            onClick={e => window.open(file.url, '_blank')}
            shape="square"
            size={80}
            icon={<FileOutlined />}
          />
        )
      })}
    </Fragment>
  )
}

export default FileList
