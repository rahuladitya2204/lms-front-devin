import { Button, Card, Col, Row, Space, Table } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  VideoCameraOutlined,
  VideoCameraTwoTone
} from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import { User } from '@adewaskar/lms-common'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'

function ViewRecording(props: { fileId: string }) {
  const { data: file } = User.Queries.useGetFileDetails(props.fileId)
  console.log(file, 'file')
  return (
    <ActionModal
      cta={
        <Button>
          <VideoCameraTwoTone /> Recording
        </Button>
      }
    >
      <MediaPlayer fileId={file.encoded} />
    </ActionModal>
  )
}

export default ViewRecording
