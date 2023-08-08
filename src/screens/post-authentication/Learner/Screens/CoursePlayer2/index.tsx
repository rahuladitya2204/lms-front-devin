import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Input,
  List,
  Row,
  Space,
  Tooltip,
  Typography
} from 'antd'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Learner, Types } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal'
import CoursePlayerCollapsible from './CoursePlayerNavigator/CoursePlayerNavigator'
import CoursePlayerMoreInfo from './CoursePlayerMoreInfo'
import FileList from '@Components/FileList'
import Header from '@Components/Header'
import OrgLogo from '@Components/OrgLogo'
import ReviewCourse from '../Products/Courses/ReviewCourse/ReviewCourse'
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

const PlayerContainer = styled.div`
  /* .ant-row,
  .ant-list-item,
  input,
  .tablist,
  .ant-card-body,
  span,
  button {
    background-color: #1b1834 !important;
    color: #fff !important;
  }
  .ant-typography {
    color: #fff;
  } */
`

const CustomHeader = styled(Header)`
  .ant-layout-header {
    padding: 0 !important;
  }

`
const { Search } = Input
const { Text } = Typography
function CoursePlayer() {
  const [showReview, setShowReview] = useState(false)
  const { id: courseId, itemId } = useParams();
  const {data: course}=Learner.Queries.useGetCourseDetails(courseId+'')
  const { data: {  metadata:{progress} ,review} } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: 'course',
      id: courseId + ''
    },
    {
      enabled: !!courseId
    }
  )
  const navigate = useNavigate()
  const instructor = course.instructor as unknown as Types.Instructor;

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
  const currentItem = allItems.find(i => i._id === itemId) || { files: [] }
  const nextItem = allItems[currentItemIndex + 1]
  const prevItem = allItems[currentItemIndex - 1]

  const next = () => {
    navigate(`section/${nextItem.section}/item/${nextItem._id}`)
  }

  const prev = () => {
    navigate(`section/${prevItem.section}/item/${prevItem._id}`)
  }

  useEffect(
    () => {
      if (progress === 50 && !review) {
        setShowReview(true)
      }
    },
    [progress]
  )


  return (
    <PlayerContainer>
      <ActionModal width={800} open={showReview}>
        <ReviewCourse course={course} />
      </ActionModal>
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
      />
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
                  height: 550,
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
            <Space style={{marginTop:20}}>
                <Avatar src={instructor.image} /><Text strong><span style={{color: 'grey'}}>Author</span>: {instructor.name}</Text>
              </Space></Col>
            {currentItem.files.length ? (
              <Col span={24}>

               
                <Card style={{ marginTop: 15 }}>
                  Attached Files
                  <FileList               userType="learner"
 style={{display: 'flex !important'}} horizontal type="card" files={currentItem.files} />
                </Card>
              </Col>
            ) : null}

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
            onChange={console.log}
            size="large"
            style={{ marginBottom: 20 }}
          />

          <CoursePlayerCollapsible
            courseId={course._id}
            toggleItemCheck={toggleItemCheck}
          />
        </Col>
      </Row>
    </PlayerContainer>
  )
}

export default CoursePlayer
