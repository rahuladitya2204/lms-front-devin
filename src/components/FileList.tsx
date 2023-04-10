import { Avatar, Modal, Space } from 'antd'
import { Fragment, useState } from 'react'

import { FileOutlined } from '@ant-design/icons'
import { Types } from '@adewaskar/lms-common'

interface FileListPropsI {
  files: { name: string, key: string, url?: string }[];
}

function FileList(props: FileListPropsI) {
  return (
    <Space size={[20, 20]}>
      {props.files?.map(file => {
        console.log(file,'file')
        return (
          <Avatar
            onClick={e => window.open(file.url, '_blank')}
            shape="square"
            size={80}
            icon={<FileOutlined />}
          />
        )
      })}
    </Space>
  )
}

export default FileList
