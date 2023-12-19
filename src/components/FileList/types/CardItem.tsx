import { Avatar, Button, Divider, List, Modal } from 'antd'
import { DownloadOutlined, FileTwoTone } from '@ant-design/icons'

import { Common } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography'
import { unit } from 'mathjs'

const { Text } = Typography

interface FileItemPropsI {
  file: Partial<{ name: string, file: string }>;
  useGetFileDetails: Function;
}

function FileItem({ file: { name, file: fileId } ,useGetFileDetails}: FileItemPropsI) {
  const { data: file } = useGetFileDetails(fileId + '')
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
