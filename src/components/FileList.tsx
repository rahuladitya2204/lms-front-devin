import { Avatar, Modal, Space } from 'antd'
import { Common, Learner, Types } from '@adewaskar/lms-common'
import { Fragment, useState } from 'react'

import { FileOutlined } from '@ant-design/icons'
import { FileType } from '@adewaskar/lms-common/lib/cjs/types/types/Common.types'

interface FileItemPropsI {
  file: Partial<FileType>;
}

function FileItem({ file }: FileItemPropsI) {
  const { data: url } = Learner.Queries.useGetPresignedUrl(file.key + '')
  return (
    <Avatar
      onClick={e => window.open(url, '_blank')}
      shape="square"
      size={80}
      icon={<FileOutlined />}
    />
  )
}

interface FileListPropsI {
  files: Partial<FileType>[];
}

function FileList(props: FileListPropsI) {
  return (
    <Space size={[20, 20]}>
      {props.files?.map(file => {
        return <FileItem file={file} />
      })}
    </Space>
  )
}

export default FileList
