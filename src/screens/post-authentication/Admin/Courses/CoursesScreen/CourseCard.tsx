import { Badge, Card, Tooltip } from 'antd'
import {
  EyeOutlined,
  FormatPainterOutlined,
  SettingOutlined,
  ToolOutlined,
  WechatOutlined
} from '@ant-design/icons'

import Avatar from 'antd/lib/avatar/avatar'
import { CourseType } from '../../../../../types/Courses.types'
import Meta from 'antd/lib/card/Meta'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

interface CourseCardProps {
  course: CourseType;
}

const CourseCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`

function CourseCard(props: CourseCardProps) {
  const navigate = useNavigate()
  return (
    <CourseCardHolder
      style={{ width: 300 }}
      cover={
        <Badge.Ribbon color="orange" text="Unpublished">
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        </Badge.Ribbon>
      }
      actions={[
        <SettingOutlined
          onClick={() => navigate(`/courses/editor/${props.course._id}`)}
        />,
        <Tooltip placement="bottom" title={'Go to course builder'}>
          <ToolOutlined
            onClick={() => navigate(`builder/${props.course._id}`)}
          />
        </Tooltip>,
        <Tooltip placement="bottom" title={'Build landing page'}>
          <FormatPainterOutlined
            onClick={() =>
              navigate(`${props.course._id}/editor`)
            }
          />
        </Tooltip>,
        <EyeOutlined />,
        <WechatOutlined />,
        <SettingOutlined />
      ]}
    >
      <Meta
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={props.course.title}
      />
    </CourseCardHolder>
  )
}

export default CourseCard
