import { Avatar, Badge, Card, Tooltip } from 'antd'
import {
  BarChartOutlined,
  EyeOutlined,
  FormatPainterOutlined,
  InfoCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { Enum, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'

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
  const coverImage = <Image height={200}
    alt="example"
    src={props.course.thumbnailImage}

  />;

  const isPublished = props.course.status === Enum.CourseStatus.PUBLISHED;
  const isDraft = props.course.status === Enum.CourseStatus.DRAFT;
  return (
    <CourseCardHolder hoverable

      cover={(isDraft || isPublished)?
        <Badge.Ribbon color={isDraft?"orange":"green"} text={isDraft?"Draft":"Published"}>
         {coverImage}
        </Badge.Ribbon>:coverImage
      }
      actions={[
        <InfoCircleOutlined
          onClick={() => navigate(`${props.course._id}/editor#information`)}
        />,
        <Tooltip placement="bottom" title={'Go to course builder'}>
          <ToolOutlined
            onClick={() => navigate(`${props.course._id}/builder`)}
          />
        </Tooltip>,
        // <Tooltip placement="bottom" title={'Build landing page'}>
        //   <FormatPainterOutlined
        //     onClick={() =>
        //       navigate(`${props.course._id}/editor`)
        //     }
        //   />
        // </Tooltip>,
        <BarChartOutlined onClick={() => {
          navigate(`${props.course._id}/analytics`)
        }} />,
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta
        // @ts-ignore
        description={`Last Updated: ${dayjs(props.course.updatedAt).format('l')}`}
        avatar={<Avatar src={instructor?.image} />}
        title={props.course.title || ''}
      />
    </CourseCardHolder>
  )
}

export default CourseCard
