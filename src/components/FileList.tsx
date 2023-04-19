import { Avatar, Modal, Space } from 'antd'
import { Common, Learner, Types, User } from '@adewaskar/lms-common'
import { Fragment, useState } from 'react'

import { FileOutlined } from '@ant-design/icons'
import { FileType } from '@adewaskar/lms-common/lib/cjs/types/types/Common.types'
import FileTypeIcon from './FileTypeIcon'
import styled from '@emotion/styled'

interface FileItemPropsI {
  file: Partial<FileType>;
}

const FileDiv = styled.div`
  cursor: pointer;
  font-size: 30px;
  margin-right: 10px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 5px 0px;
  border-radius: 5px;
  span {
    margin-right: 0 !important;
  }
`

function FileItem({ file }: FileItemPropsI) {
  // const { data: url } = User.Queries.useGetPresignedUrl(file.key + '')
  return (
    <FileDiv>
      <FileTypeIcon
        onClick={(e: any) => window.open(file.url)}
        fileType={file.type}
      />
    </FileDiv>
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
