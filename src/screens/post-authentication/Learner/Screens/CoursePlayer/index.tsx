import { Button, Card, Col, Progress, Row, Typography } from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router'
import CoursePlayerCollapsible from './CoursePlayerCollapsible/CoursePlayerCollapsible'
import CoursePlayerMoreInfo from './CoursePlayerMoreInfo'
import { useEffect } from 'react'
import { useGetCourseDetails } from '@Learner/Api/queries'
import Header from '@Components/Header'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'

const ControlButton = styled(Button)`
  position: absolute;
  top: 250px;
  padding: 0px;
  width: 23px;
  border-radius: 0;
  display: none;
`

const CustomCard = styled(Card)`
  &:hover {
    button {
      display: block;
    }
  }
`

const Text = Typography.Text
function CoursePlayer() {
  const { id: courseId, sectionId, itemId } = useParams()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })
  const navigate = useNavigate()

  const sections = courseDetails.sections

  useEffect(
    () => {
      console.log('ohoh')
      if (sections[0]?.items[0]) {
        const sectionId = sections[0].id
        const itemId = sections[0].items[0].id
        navigate(`section/${sectionId}/item/${itemId}`)
      }
    },
    [sections]
  )

  const toggleItemCheck = () => {}

  let currentSectionIndex, currentSectionItemIndex, nextSection, nextItem

  sections.forEach((s, index) => {
    if (s.id === sectionId) currentSectionIndex = index
  })
  if (currentSectionIndex) {
    sections[currentSectionIndex].items.forEach((i, index) => {
      if (i.id === itemId) currentSectionItemIndex = index
    })
  }

  nextSection = currentSectionIndex ? sections[currentSectionIndex + 1] : null;

  nextItem = currentSectionItemIndex
    ? sections[currentSectionItemIndex + 1]
    : null;

  const next = () => {}

  const prev = () => {}

  return (
    <Header
      title={'Udemy'}
      style={{ padding: 10, borderBottom: '1px solid #cac7c7' }}
      extra={[
        <Text strong>
          Your Progress<Progress
            style={{ marginLeft: 10 }}
            type="circle"
            percent={30}
            width={40}
          />
        </Text>
      ]}
    >
      <Row
        style={{ padding: '0 10px' }}
        gutter={[10, 40]}
        justify="space-between"
      >
        <Col span={17}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <CustomCard
                style={{ height: 500, overflow: 'hidden' }}
                bodyStyle={{ padding: 0, position: 'relative' }}
              >
                <ControlButton
                  type="primary"
                  style={{
                    right: 0
                  }}
                  onClick={next}
                  icon={<CaretRightOutlined />}
                />
                <ControlButton
                  style={{
                    left: 0
                  }}
                  onClick={prev}
                  type="primary"
                  icon={<CaretLeftOutlined />}
                />

                <Outlet context={[sections]} />
              </CustomCard>
            </Col>
            <Col span={24}>
              <Card>
                <CoursePlayerMoreInfo course={courseDetails} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={7}>
          <CoursePlayerCollapsible
            toggleItemCheck={toggleItemCheck}
            sections={sections}
          />
        </Col>
      </Row>
    </Header>
  )
}

export default CoursePlayer
