import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { ButtonProps } from 'antd/lib'
import { useNavigate } from '@Router/index'

function BackButton(props: ButtonProps) {
  const navigate = useNavigate()
  return (
    // <span>
    <Button
      {...props}
      onClick={e => (props.onClick ? props.onClick(e) : navigate(-1))}
      // size="small"
      style={{ marginRight: 10 }}
    >
      <ArrowLeftOutlined /> {props.children}
    </Button>
    // </span>
  )
}

export default BackButton
