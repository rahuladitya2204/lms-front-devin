import { Avatar, Badge, Card, Tooltip } from 'antd'
import {
  EyeOutlined,
  FormatPainterOutlined,
  InfoCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons'

import Image from '@Components/Image'
import { Types } from '@adewaskar/lms-common'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

interface CourseCardProps {
  course: Types.Course;
}

const CourseCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`

function CourseCard(props: CourseCardProps) {
  const navigate = useNavigate();
  const instructor = props.course.instructor as unknown as Types.Instructor;
  return (
    <CourseCardHolder hoverable

      cover={
        <Badge.Ribbon color="orange" text="Unpublished">
          <Image
            alt="example"
            src={props.course.thumbnailImage}

          />
        </Badge.Ribbon>
      }
      actions={[
        <InfoCircleOutlined
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
      <Card.Meta description={`By ${instructor?.name}`}
        avatar={<Avatar src={instructor?.image} />}
        title={props.course.title || ''}
      />
    </CourseCardHolder>
  )
}

export default CourseCard
