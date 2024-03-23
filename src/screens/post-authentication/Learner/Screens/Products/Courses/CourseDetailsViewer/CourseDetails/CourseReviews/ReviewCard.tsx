import { Avatar, List, Rate } from 'antd'
import { Common, Types } from '@invinciblezealorg/lms-common'

import { Typography } from '@Components/Typography';
import { capitalize } from 'lodash'

const { Title, Paragraph } = Typography

interface ReviewCardPropsI {
  review: Types.ProductReview;
}

function ReviewCard(props: ReviewCardPropsI) {
  const { review } = props
  return (
    <List.Item
      style={{ marginBottom: 30 }}
      extra={[<Rate style={{ fontSize: 12 }} disabled value={review.rating} />]}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            style={{
              backgroundColor: 'orange'
            }}
          >
            {/* @ts-ignore */}
            {capitalize(review.learner.name[0])}
          </Avatar>
        }
        // @ts-ignore
        title={<a>{capitalize(review.learner.name)}</a>}
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
