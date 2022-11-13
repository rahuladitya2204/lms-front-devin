import { Badge, Card, Tooltip } from 'antd'
import {
  EyeOutlined,
  FormatPainterOutlined,
  SettingOutlined,
  ToolOutlined,
  WechatOutlined
} from '@ant-design/icons'

import Avatar from 'antd/lib/avatar/avatar'
import Meta from 'antd/lib/card/Meta'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'
import { Course } from '@Types/Courses.types'

interface CourseCardProps {
  course: Course;
}

const CourseCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`

function CourseCard(props: CourseCardProps) {
  const navigate = useNavigate()
  return (
    <CourseCardHolder hoverable

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
          onClick={() => navigate(`${props.course._id}/editor`)}
        />,
        <Tooltip placement="bottom" title={'Go to course builder'}>
          <ToolOutlined
            onClick={() => navigate(`${props.course._id}/builder`)}
          />
        </Tooltip>,
        <Tooltip placement="bottom" title={'Build landing page'}>
          <FormatPainterOutlined
            onClick={() =>
              navigate(`${props.course._id}/editor`)
            }
          />
        </Tooltip>,
        <EyeOutlined onClick={() => {
          navigate(`${props.course._id}/player`)
        }} />,
        // <WechatOutlined />,
        // <SettingOutlined />
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
