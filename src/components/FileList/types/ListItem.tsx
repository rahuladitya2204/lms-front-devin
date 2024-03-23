import { Button, Empty, List, Modal, Space, Spin } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons'

import { Common } from '@adewaskar/lms-common'

const { confirm } = Modal

interface FileItemPropsI {
  file: Partial<{ name: string, file: string }>;
  onDeleteFile: (id: string) => void;
  useGetFileDetails: Function;
}

function FileItem({
  file: { name, file: fileId },
  useGetFileDetails,
  onDeleteFile
}: FileItemPropsI) {
  const { data: file } = useGetFileDetails(fileId + '')
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
