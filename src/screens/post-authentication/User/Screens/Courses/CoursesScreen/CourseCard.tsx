import { Avatar, Badge, Card, Tooltip } from 'antd'
import {
  EyeOutlined,
  FormatPainterOutlined,
  InfoCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons'

import Image from '@Components/Image'
import { Constants, Types } from '@adewaskar/lms-common'
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

const STATUS_COLOR_MAP={
  'draft': 'orange',
  'published':'red'
}

function CourseCard(props: CourseCardProps) {
  const { course } = props;
  const navigate = useNavigate();
  const instructor = course.instructor as unknown as Types.Instructor;
  return (
    <CourseCardHolder hoverable

      cover={
        // @ts-ignore
        <Badge.Ribbon color={STATUS_COLOR_MAP[course.status]} text={Constants.COURSE_STATUSES_MAP[course.status]?.label}>
          <Image height={200}
            alt="example"
            src={course.thumbnailImage}

          />
        </Badge.Ribbon>
      }
      actions={[
        <InfoCircleOutlined
          onClick={() => navigate(`${course._id}/editor`)}
        />,
        <Tooltip placement="bottom" title={'Go to course builder'}>
          <ToolOutlined
            onClick={() => navigate(`${course._id}/builder`)}
          />
        </Tooltip>,
        <Tooltip placement="bottom" title={'Build landing page'}>
          <FormatPainterOutlined
            onClick={() =>
              navigate(`${course._id}/editor`)
            }
          />
        </Tooltip>,
        <EyeOutlined onClick={() => {
          navigate(`${course._id}/player`)
        }} />,
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta description={`By ${instructor?.name}`}
        avatar={<Avatar src={instructor?.image} />}
        title={course.title || ''}
      />
    </CourseCardHolder>
  )
}

export default CourseCard
