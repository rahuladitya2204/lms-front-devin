import { Card, Progress, Typography } from 'antd'

import Image from '@Components/Image'
import { Types } from '@adewaskar/lms-common'
import styled from '@emotion/styled'

const { Text } = Typography

interface CourseCardPropsI {
  course: Types.Course;
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
