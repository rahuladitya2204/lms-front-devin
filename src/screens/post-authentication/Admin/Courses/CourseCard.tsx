import { Card, Tooltip } from 'antd'
import {
  EyeOutlined,
  FormatPainterOutlined,
  SettingOutlined,
  ToolOutlined,
  WechatOutlined
} from '@ant-design/icons'

import Avatar from 'antd/lib/avatar/avatar'
import { CourseType } from '../../../../types/Courses.types'
import Meta from 'antd/lib/card/Meta'
import { useNavigate } from 'react-router'

interface CourseCardProps {
  course: CourseType;
}

function CourseCard(props: CourseCardProps) {
  const navigate = useNavigate()
  return (
    <Card
      style={{ width: 300 }}
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      actions={[
        <SettingOutlined />,
        <Tooltip placement="bottom" title={'Go to course builder'}>
          <ToolOutlined
            onClick={() => navigate(`builder/${props.course._id}`)}
          />
        </Tooltip>,
        <Tooltip placement="bottom" title={'Build landing page'}>
          <FormatPainterOutlined />
        </Tooltip>,
        <EyeOutlined />,
        <WechatOutlined />,
        <SettingOutlined />
      ]}
    >
      <Meta
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={props.course.title}
        description={props.course.description}
      />
    </Card>
  )
}

export default CourseCard
