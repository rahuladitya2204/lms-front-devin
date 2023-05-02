import { Avatar, Button, Divider, List, Modal, Typography } from 'antd'
import { Common } from '@adewaskar/lms-common'
import { DownloadOutlined, FileTwoTone } from '@ant-design/icons'

import { unit } from 'mathjs'

const { Text } = Typography

interface FileItemPropsI {
  file: Partial<{ name: string, file: string }>;
}

function FileItem({ file: { name, file: fileId } }: FileItemPropsI) {
  const { data: file } = Common.Queries.useGetFileDetails(fileId + '')
  const size = Math.ceil(
    unit(file.size, 'byte')
      .to('megabyte')
      .toJSON().value
  )
  return (
    <List.Item style={{width: 250}}
      extra={
        [<Button size='small'
          onClick={() => {
            <DownloadOutlined
              onClick={e => {
                Common.Api.GetPresignedUrl(file._id).then(url =>
                  window.open(url)
                )
              }}
            />
          }}
          icon={<DownloadOutlined />}
        />]
      }
    >
      <List.Item.Meta
        avatar={
          <Avatar
            style={{ marginTop: 8 }}
            shape="square"
            src={<FileTwoTone style={{ fontSize: 25 }} />}
          />
        }
        title={
          <Text ellipsis style={{ marginBottom: 0 }}>
            {file.name}
          </Text>
        }
        description={
          <>
            <Text style={{ fontSize: 12,color:'grey' }}>{size} MB</Text>
          </>
        }
      />
    </List.Item>
  )
}

export default FileItem
