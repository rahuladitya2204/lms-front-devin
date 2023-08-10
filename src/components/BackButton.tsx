import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router'

function BackButton(props: any) {
  const navigate = useNavigate()
  return (
    <span onClick={(e) => (props.onClick ? props.onClick(e) : navigate(-1))}>
      <Button ghost>
        <ArrowLeftOutlined />
      </Button>
    </span>
  )
}

export default BackButton
