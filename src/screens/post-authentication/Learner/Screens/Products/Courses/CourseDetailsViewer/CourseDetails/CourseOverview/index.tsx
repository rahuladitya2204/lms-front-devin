import { Card, Col, List, Row, Skeleton, Typography } from 'antd'
import { Common, Learner, Types } from '@adewaskar/lms-common'

import { Fragment } from 'react'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import Image from '@Components/Image'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'

const { Title, Paragraph } = Typography

interface CourseOverviewPropsI {
  course: Types.Course;
  hidePreview?: boolean;
}

function CourseOverview(props: CourseOverviewPropsI) {
  const courseId = props.course._id
  const {
    data: course,
    isFetching: loadingCourse
  } = Learner.Queries.useGetCourseDetails(courseId, {
    enabled: !!courseId
  })
  const { landingPage } = course
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
        {(landingPage?.promoVideo?.url) ? (
          <Col span={24}>
            <Card
              style={{ margin: '20px 0' }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <MediaPlayer height={400} url={landingPage?.promoVideo?.url} />
            </Card>
          </Col>
        ) : null}
        <Col span={24}>
          {loadingCourse ? (
            <Skeleton paragraph={{ rows: 30 }} active />
          ) : (
            <Paragraph style={{ fontSize: 16 }}>
              <HtmlViewer content={landingPage.description} />
            </Paragraph>
          )}
        </Col>
      </Row>
    </Fragment>
  )
}

export default CourseOverview
