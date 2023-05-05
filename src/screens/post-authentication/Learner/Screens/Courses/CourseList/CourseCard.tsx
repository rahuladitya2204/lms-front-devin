import { Card, Progress, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import dayjs from 'dayjs'
import styled from '@emotion/styled'

const { Text } = Typography

interface CourseCardPropsI {
  course: Types.Course;
  enrolledAt: string;
  progress: number;
  onClick: () => void;
}

const CardHolder = styled(Card)`
  cursor: pointer;

  .ant-card-cover {
    height: 200px !important;
  }
`

const CourseCard: React.FC<CourseCardPropsI> = props => {
  const { course: { _id: courseId } } = props
  const {
    data: { course, progress }
  } = Learner.Queries.useGetEnrolledCourseDetails(courseId)
  return (
    <CardHolder
      hoverable
      onClick={props.onClick}
      bodyStyle={{ padding: 10 }}
      cover={
        <Image height={180} alt="example" src={props.course.thumbnailImage} />
      }
    >
      <Card.Meta
        // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={
          <Text style={{ fontSize: 13 }} type="secondary">
            Started {dayjs(props.enrolledAt).format('MMMM D, YYYY')}
          </Text>
        }
        description={<Text strong>{course.title}</Text>}
      />
      <Progress percent={progress} />
    </CardHolder>
  )
}

export default CourseCard
