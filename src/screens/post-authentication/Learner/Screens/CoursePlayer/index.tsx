import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Tooltip,
  Typography
} from 'antd'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Fragment, useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'

import CoursePlayerCollapsible from './CoursePlayerNavigator/CoursePlayerNavigator'
import CoursePlayerMoreInfo from './CoursePlayerMoreInfo'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'
import OrgLogo from '@Components/OrgLogo'
import styled from '@emotion/styled'

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
const CustomHeader = styled(Header)`
  .ant-layout-header {
    padding: 0 !important;
  }
  /* & {
  } */
`
const { Search } = Input
const { Text } = Typography
function CoursePlayer() {
  const { id: courseId, itemId } = useParams()
  const {
    data: { course, progress }
  } = Learner.Queries.useGetEnrolledCourseDetails(courseId + '', {
    enabled: !!courseId
  })
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

  const allItems = sections.map((s: any) => s.items).flat()

  const toggleItemCheck = () => {}
  let currentItemIndex = 0

  allItems.forEach((i: any, index: number) => {
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
    <Fragment>
      <CustomHeader
        className="page-header"
        // bgColor="black"
        title={
          <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
            <OrgLogo />
            <Divider type="vertical" />
            <Text style={{ fontSize: 16 }}>{course.title}</Text>
          </Space>
        }
        subTitle={<Text style={{ fontSize: 20 }}>{course.title}</Text>}
        style={{ padding: 0, borderBottom: '1px solid #cac7c7' }}
        // extra={[
        //   <Text strong style={{ paddingRight: 10 }}>
        //     Your Progress<Progress
        //       style={{ marginLeft: 10 }}
        //       type="circle"
        //       percent={progress}
        //       width={40}
        //     />
        //   </Text>
        // ]}
      />{' '}
      <Row
        style={{ padding: '20px 10px', background: '#f4f4f4' }}
        gutter={[10, 40]}
        justify="space-between"
      >
        <Col span={18}>
          <Row>
            <Col span={24}>
              <div
                style={{
                  height: 533,
                  padding: 0,
                  position: 'relative',
                  background: '#fff',
                  overflow: 'scroll'
                }}
                // bodyStyle={{}}
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
                      icon={<CaretRightOutlined />}
                    />
                  </Tooltip>
                ) : null}
                <Outlet context={[sections, course._id]} />
              </div>
            </Col>
            <Col span={24}>
              <Card style={{ marginTop: 30 }}>
                <CoursePlayerMoreInfo course={course} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Search
            placeholder="Search in course.."
            // onSearch={onSearch}
            size="large"
            style={{ marginBottom: 20 }}
          />

          <CoursePlayerCollapsible
            courseId={course._id}
            toggleItemCheck={toggleItemCheck}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default CoursePlayer
