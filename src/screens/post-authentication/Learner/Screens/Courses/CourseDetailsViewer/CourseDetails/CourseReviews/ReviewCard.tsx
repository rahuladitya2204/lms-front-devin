import { Avatar, List, Rate, Typography } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'

const { Title, Paragraph } = Typography

interface ReviewCardPropsI {
  review: Types.CourseReview;
}

function ReviewCard(props: ReviewCardPropsI) {
  const { review } = props
  return (
    <List.Item
      style={{ marginBottom: 30 }}
      extra={[<Rate disabled value={review.rating} />]}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            style={{
              backgroundColor: 'orange'
            }}
          >
            {/* @ts-ignore */}
            {review.learner.name[0]}
          </Avatar>
        }
        // @ts-ignore
        title={<a>{review.learner.name}</a>}
        description={
          <Paragraph style={{ marginRight: 30, color: '#77838F' }}>
            {review.comment}
          </Paragraph>
        }
      />
    </List.Item>
  )
}

export default ReviewCard
