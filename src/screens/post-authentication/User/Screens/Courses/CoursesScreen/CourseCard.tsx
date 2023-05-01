import { Avatar, Badge, Button, Card, List, Tag, Tooltip,Typography } from 'antd'
import {
  BookOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FormatPainterOutlined,
  InfoCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons'

import Image from '@Components/Image'
import { Constants, Types, Utils } from '@adewaskar/lms-common'
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


const { Text } = Typography;

function CourseCard(props: CourseCardProps) {
  const { course } = props;
  const navigate = useNavigate();
  const instructor = course.instructor as unknown as Types.Instructor;
  return (
    <List.Item
        key={course.title}
      actions={[
        <Button onClick={() => navigate(`${course._id}/editor`)} icon={<InfoCircleOutlined
          
        />}></Button>,
        <Tooltip placement="bottom" title={'Go to course builder'}>
         <Button onClick={() => navigate(`${course._id}/builder`)} icon={ <ToolOutlined
            
          />} />
        </Tooltip>,
        <Tooltip placement="bottom" title={'Build landing page'}>
          <Button onClick={() =>
              navigate(`${course._id}/editor`)
            } icon={<FormatPainterOutlined
            
          />}></Button>
        </Tooltip>,
        <Button  onClick={() => {
          navigate(`${course._id}/player`)
        }} icon={<EyeOutlined />} />
      ]}
        extra={
               <Badge.Ribbon color={STATUS_COLOR_MAP[course.status]} text={Constants.COURSE_STATUSES_MAP[course.status].label}>
   <Image
            width={272}
            alt="logo"
            src={course.thumbnailImage}
            />
            </Badge.Ribbon>
        }
      >
        <List.Item.Meta
          // avatar={<Avatar src={item.avatar} />}
          title={course.title}
          description={course.subtitle?course.subtitle:null}
      />

      <Tag icon={<ClockCircleOutlined/>} color='blue'>Total Duration: {Utils.formatTime(course.totalDuration)}</Tag>
      <Tag icon={<BookOutlined/>}>Lessons: {course.totalItems}</Tag>
      </List.Item>
  )
}

export default CourseCard
