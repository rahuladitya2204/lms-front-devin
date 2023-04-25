import { Card, Col, List, Row, Typography } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'

import { Fragment } from 'react'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'

const { Title, Paragraph } = Typography

interface CourseOverviewPropsI {
  course: Types.Course;
  hidePreview?: boolean;
}

function CourseOverview(props: CourseOverviewPropsI) {
  const { landingPage } = props.course
  const { data: PromoVideoUrl } = Common.Queries.useGetPresignedUrl(
    landingPage?.promoVideo
  )
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
        {!props.hidePreview ? (
          <Col span={24}>
            <Card
              style={{ margin: '20px 0' }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <MediaPlayer url={PromoVideoUrl} />
            </Card>
          </Col>
        ) : null}
        <Col span={24}>
          {/* <Title level={4}>Course Description</Title> */}
          <Paragraph
            style={{ fontSize: 16 }}
            // ellipsis={{
            //   rows: 2,
            //   expandable: true,
            //   symbol: 'readmore'
            // }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: landingPage.description }}
            />
          </Paragraph>
        </Col>

        {/* <Col span={24}>
          <Title level={4}>What You'll Learn</Title>
          <Paragraph>
            <div
              dangerouslySetInnerHTML={{ __html: props.course.whatYouLearn }}
            />
          </Paragraph>
        </Col>

        <Col span={24}>
          <Title level={4}>Course Requirements</Title>
          <Paragraph>
            <div
              dangerouslySetInnerHTML={{ __html: props.course.requirements }}
            />
          </Paragraph>
        </Col> */}
      </Row>
    </Fragment>
  )
}

export default CourseOverview
