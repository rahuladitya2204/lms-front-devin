import { Button, Card, Col, Row, Space, Table } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'

function ViewRecording({ session }: { session: Types.LiveSession }) {
  const { data: file } = User.Queries.useGetFileDetails(session.recording.file)
  return (
    <ActionModal
      title={session.title}
      width={900}
      cta={<Button size="small">View Recording</Button>}
    >
      <MediaPlayer height={500} fileId={file.encoded} />
    </ActionModal>
  )
}

export default ViewRecording
