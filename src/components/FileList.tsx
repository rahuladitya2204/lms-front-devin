import {  Button, Empty, List, Modal, Space, Spin } from 'antd'
import { Common } from '@adewaskar/lms-common'
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons'

import ActionModal from './ActionModal'

const { confirm } = Modal

interface FileItemPropsI {
  file: Partial<{ name: string, file: string }>;
  onDeleteFile: (id: string) => void;
}

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
  uploadFileInput?: any;
}

function FileList(props: FileListPropsI) {
  return (
    <Space><Space size={[20, 20]}>
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
     <ActionModal
     cta={props.uploadFileInput?
       <Button
         type="primary"
         shape="round"
         icon={<PlusOutlined />}
         size={'large'}
       />:null
     }
   >
        <>
          {props.uploadFileInput}
        </>
   </ActionModal></Space>

  )
}

export default FileList
