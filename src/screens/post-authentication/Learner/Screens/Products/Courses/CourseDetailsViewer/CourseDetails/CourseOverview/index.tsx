import { Card, Col, List, Row, Skeleton, Typography } from 'antd'
import { Common, Learner, Types } from '@adewaskar/lms-common'

import { Fragment } from 'react'
import HtmlViewer from '@Components/HtmlViewer'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'

const { Title, Paragraph } = Typography

interface CourseOverviewPropsI {
  course: Types.Course;
  hidePreview?: boolean;
}

function CourseOverview(props: CourseOverviewPropsI) {
  const {
    data: course,
    isLoading: loadingCourse
  } = Learner.Queries.useGetCourseDetails(props.course._id)
  const { landingPage } = course
  const {
    data: PromoVideoUrl,
    isLoading: loadingVideoUrl
  } = Common.Queries.useGetPresignedUrlFromFile(landingPage?.promoVideo, {
    enabled: !!landingPage?.promoVideo
  })
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
        {!props.hidePreview ? (
          <Col span={24}>
            {!loadingVideoUrl ? (
              <Card
                style={{ margin: '20px 0' }}
                bordered={false}
                bodyStyle={{ padding: 0 }}
              >
                {' '}
                <MediaPlayer height={400} url={PromoVideoUrl} />
              </Card>
            ) : (
              <Skeleton active style={{ height: 400 }} />
            )}
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
