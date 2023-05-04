import { Card, Col, Progress, Rate, Row, Space, Typography } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'

import { Fragment } from 'react'
import HtmlViewer from '@Components/HtmlViewer'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import { formatAvgCount } from '@User/Screens/Courses/CourseBuilder/utils'

const { Title, Text } = Typography

interface CourseReviewsPropsI {
  course: Types.Course;
  hidePreview?: boolean;
}

function CourseReviews(props: CourseReviewsPropsI) {
  const {
    landingPage,
    averageRating,
    ratingMap,
    numberOfReviews
  } = props.course
  const { data: PromoVideoUrl } = Common.Queries.useGetPresignedUrlFromFile(
    landingPage?.promoVideo,
    {
      enabled: !!landingPage?.promoVideo
    }
  )
  const reviews = Object.keys(ratingMap)
    .map((rating: any) => {
      // @ts-ignore
      const count = ratingMap[rating]
      const share = Math.ceil(count / numberOfReviews * 100)
      return {
        rating: rating,
        count: count,
        share: share
      }
    })
    .filter(i => i.count)
  return (
    <Row>
      <Col span={24}>
        <Title level={4}>Student Feedback</Title>
        <Row>
          <Col>
            <Card style={{ width: 300}} hoverable>
                          <Space  style={{width:'100%'}} direction='vertical' align='center'>
                          <Title style={{textAlign:'center',marginTop:0,marginBottom:0}}>{averageRating}</Title>
              <Text strong style={{textAlign:'center'}}>Course Rating</Text>
              <Rate disabled value={averageRating} />
             </Space>
            </Card>
          </Col>
          <Col flex={1}>
            <Card style={{ marginLeft: 20 }}>
              {reviews.map(review => {
                return (
                  <Progress
                    style={{ width: '60%' }}
                    percent={review.share}
                        format={() => {
                            return <>
                            
                        <Rate disabled style={{marginLeft:20,marginRight:20}} value={review.rating} />

                        <Text>
                        {formatAvgCount(review.count)} reviews
                      </Text>
                    </>
                    }}
                  />
                )
              })}
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default CourseReviews
