import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router'

function BackButton () {
  const navigate = useNavigate()
  return (
    <span onClick={() => navigate(-1)}>
      <Button type="ghost">
        <ArrowLeftOutlined />
      </Button>
    </span>
  )
}

export default BackButton
