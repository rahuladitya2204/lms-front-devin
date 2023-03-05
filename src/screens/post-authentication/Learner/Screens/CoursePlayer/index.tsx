import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Image,
  Progress,
  Row,
  Space,
  Tooltip,
  Typography
} from 'antd'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Outlet, useNavigate, useParams } from 'react-router'

import CoursePlayerCollapsible from './CoursePlayerNavigator/CoursePlayerNavigator'
import CoursePlayerMoreInfo from './CoursePlayerMoreInfo'
import Header from '@Components/Header'
import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useGetEnrolledCourseDetails } from '@Learner/Api/Course/queries'

const ControlButton = styled(Button)`
  position: absolute;
  top: 220px;
  padding: 0px;
  width: 18px !important;
  border-radius: 0;
  display: block;
  z-index: 999;
`

const CustomCard = styled(Card)`
  &:hover {
    button {
      display: block;
    }
  }
`

const { Text, Title } = Typography
function CoursePlayer() {
  const { id: courseId, itemId } = useParams()
  const { data: { course, progress } } = useGetEnrolledCourseDetails(
    courseId + '',
    {
      enabled: !!courseId
    }
  )
  const navigate = useNavigate()

  const sections = course.sections
  useEffect(
    () => {
      if (sections[0]?.items[0]) {
        const sectionId = sections[0]._id
        const itemId = sections[0].items[0]._id
        navigate(`section/${sectionId}/item/${itemId}`)
      }
    },
    [sections]
  )

  const allItems = sections.map(s => s.items).flat()

  const toggleItemCheck = () => {}
  let currentItemIndex = 0

  allItems.forEach((i, index) => {
    if (i._id == itemId) {
      currentItemIndex = index
    }
  })

  const nextItem = allItems[currentItemIndex + 1]
  const prevItem = allItems[currentItemIndex - 1]

  const next = () => {
    navigate(`section/${nextItem.section}/item/${nextItem._id}`)
  }

  const prev = () => {
    navigate(`section/${prevItem.section}/item/${prevItem._id}`)
  }
  return (
    <Header
      theme="dark"
      title={
        <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
          <Image
            onClick={() => navigate('/learner/123123/dashboard/courses')}
            style={{ cursor: 'pointer' }}
            width={40}
            preview={false}
            src={
              'https://asset-cdn.learnyst.com/assets/schools/110998/schoolLogo/soiclogolearnyst_r5jz9f.png'
            }
          />
          <Divider type="vertical" />
          <Text style={{ fontSize: 16 }}>{course.title}</Text>
        </Space>
      }
      subTitle={<Text style={{ fontSize: 20 }}>{course.title}</Text>}
      style={{ padding: 0, borderBottom: '1px solid #cac7c7' }}
      extra={[
        <Dropdown.Button
          menu={{
            items: [
              {
                key: '3',
                label: (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.luohanacademy.com"
                  >
                    3rd menu item
                  </a>
                )
              }
            ]
          }}
          placement="topRight"
          arrow={{ pointAtCenter: true }}
        >
          Share
        </Dropdown.Button>,
        <Text strong style={{ paddingRight: 10 }}>
          Your Progress<Progress
            style={{ marginLeft: 10 }}
            type="circle"
            percent={progress}
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
          <Row>
            <Col span={24}>
              <CustomCard
                style={{ height: 500, overflow: 'hidden' }}
                bodyStyle={{ padding: 0, position: 'relative' }}
              >
                {currentItemIndex > 0 ? (
                  <Tooltip
                    placement="right"
                    title={`Previous: ${prevItem.title}`}
                  >
                    <ControlButton
                      style={{
                        left: 0,
                        borderLeft: 0
                      }}
                      onClick={prev}
                      icon={<CaretLeftOutlined />}
                    />
                  </Tooltip>
                ) : null}

                {currentItemIndex < allItems.length - 1 ? (
                  <Tooltip placement="left" title={`Next: ${nextItem.title}`}>
                    <ControlButton
                      style={{
                        right: 0,
                        borderRight: 0
                      }}
                      onClick={next}
                      // type='primary'
                      icon={<CaretRightOutlined />}
                    />
                  </Tooltip>
                ) : null}
                <Outlet context={[sections]} />
              </CustomCard>
            </Col>
            <Col span={24}>
              <Card>
                <CoursePlayerMoreInfo course={course} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={7}>
          <CoursePlayerCollapsible
            courseId={course._id}
            toggleItemCheck={toggleItemCheck}
            sections={sections}
          />
        </Col>
      </Row>
    </Header>
  )
}

export default CoursePlayer
