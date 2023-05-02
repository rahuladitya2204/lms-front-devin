import { Button, Empty, List, Modal, Space, Spin } from 'antd'
import { Common } from '@adewaskar/lms-common'
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons'

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
    <List.Item
      actions={[
        <a key="list-loadmore-edit">
          <DownloadOutlined
            onClick={e => {
              Common.Api.GetPresignedUrl(file._id).then(url => window.open(url))
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
  )
}

export default FileItem
