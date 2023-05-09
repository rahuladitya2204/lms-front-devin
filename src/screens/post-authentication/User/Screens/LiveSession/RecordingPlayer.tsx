import { Button, Card, Col, Row, Space, Table } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  VideoCameraOutlined,
  VideoCameraTwoTone
} from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import { User } from '@adewaskar/lms-common'

function ViewRecording(props: { fileId: string }) {
  // const { data: file } = User.Queries.useGetFileDetails(props.fileId)
  // console.log(file, 'file')
  return (
    <ActionModal
      cta={
        <Button>
          <VideoCameraTwoTone /> Recording
        </Button>
      }
    >
      <MediaPlayer fileId={props.fileId} />
    </ActionModal>
  )
}

export default ViewRecording
