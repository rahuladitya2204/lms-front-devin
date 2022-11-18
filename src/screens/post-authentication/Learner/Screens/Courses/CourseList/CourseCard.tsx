import { Card, Progress, Typography } from 'antd'
import { Course } from '@Types/Courses.types'
import styled from '@emotion/styled'

const { Text } = Typography

interface CourseCardPropsI {
  course: Course;
  progress: number;
  onClick: () => void;
}

const CardHolder = styled(Card)`
  cursor: pointer;
`

const CourseCard: React.FC<CourseCardPropsI> = props => {
  return (
    <CardHolder
      hoverable
      onClick={props.onClick}
      bodyStyle={{ padding: 10 }}
      cover={<img alt="example" src={props.course.thumbnailImage} />}
    >
      <Card.Meta
        // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={
          <Text style={{ fontSize: 13 }} type="secondary">
            Started July 9, 2020
          </Text>
        }
        description={
          <Text strong>
            The Complete JavaScript Course 2020: Real Projects!
          </Text>
        }
      />
      <Progress percent={props.progress} />
    </CardHolder>
  )
}

export default CourseCard
