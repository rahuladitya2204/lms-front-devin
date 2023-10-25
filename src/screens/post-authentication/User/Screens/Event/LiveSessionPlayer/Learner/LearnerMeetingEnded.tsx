import './style.css'
import { Button, Result } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

const LearnerMeetingEnded = () => {
  return (
    <Result
      icon={<SmileOutlined />}
      title="Meeting was ended"
      extra={<Button type="primary">Return to app</Button>}
    />
  )
}

export default LearnerMeetingEnded
