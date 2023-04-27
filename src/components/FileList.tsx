import { Avatar, Button, Empty, List, Modal, Space, Spin } from 'antd'
import { Common, Learner, Types, User } from '@adewaskar/lms-common'
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileOutlined
} from '@ant-design/icons'
import { Fragment, useState } from 'react'

import FileTypeIcon from './FileTypeIcon'
import styled from '@emotion/styled'

const { confirm } = Modal

interface FileItemPropsI {
  file: Partial<{ name: string, file: string }>;
  onDeleteFile: (id: string) => void;
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

function FileItem({
  file: { name, file: fileId },
  onDeleteFile
}: FileItemPropsI) {
  const { data: file } = Common.Queries.useGetFileDetails(fileId + '')
  const {
    mutate: deleteFile,
    isLoading: deletingFile
  } = Common.Queries.useDeleteFile()
  // console
  return (
    <Spin spinning={deletingFile}>
      <List.Item
        actions={[
          <a key="list-loadmore-edit">
            <DownloadOutlined
              onClick={e => {
                Common.Api.GetPresignedUrl(file._id).then(url =>
                  window.open(url)
                )
              }}
            />
          </a>,
          <a key="list-loadmore-edit">
            <DeleteOutlined
              onClick={e => {
                confirm({
                  title: 'Are you sure?',
                  // icon: <ExclamationCircleOutlined />,
                  content: `You want to delete this file`,
                  onOk() {
                    deleteFile(
                      { id: fileId + '' },
                      {
                        onSuccess: () => {
                          onDeleteFile(fileId + '')
                        }
                      }
                    )
                  },
                  okText: 'Delete File'
                })
              }}
            />
          </a>
        ]}
      >
        {file.name}
      </List.Item>
    </Spin>
  )
}

interface FileListPropsI {
  files: { name: string, file: string }[];
  onDeleteFile: (s: string) => void;
}

function FileList(props: FileListPropsI) {
  return (
    <Space size={[20, 20]}>
      {props?.files?.length ? <>
        <List
        size="small"
        // header={<div>Files</div>}
        bordered
        dataSource={props.files}
        style={{ width: 500 }}
        renderItem={file => (
          <FileItem
            key={file.file}
            onDeleteFile={props.onDeleteFile}
            file={file}
          />
        )}
      /></> : <Empty style={{ width: 500 }} description='No Files added'>

      </Empty>
      }
      
    </Space>
  )
}

export default FileList
