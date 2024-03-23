import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Skeleton,
  Space,
  Tooltip,
} from 'antd'
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import { Learner, Store, Utils } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo, useState } from 'react'

import ActionDrawer from '@Components/ActionDrawer'
import ActionModal from '@Components/ActionModal/ActionModal'
import CoursePlayerCollapsible from './CoursePlayerNavigator/CoursePlayerNavigator'
import CoursePlayerMoreInfo from './CoursePlayerMoreInfo'
import Header from '@Components/Header'
import OrgLogo from '@Components/OrgLogo'
import ReviewCourse from '../Products/Courses/ReviewCourse/ReviewCourse'
import { Typography } from '@Components/Typography'
import styled from '@emotion/styled'
import useBreakpoint from '@Hooks/useBreakpoint'

const PlayerSkeleton = () => {
  return <>
    <div style={{ borderRadius:'10px',marginTop:20,padding:10 }}>
      <Skeleton active avatar paragraph={{ rows: 1 }} />
      </div></>
}

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
  const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress()
  const { id: courseId, itemId, sectionId } = useParams()
  const {
    data: { metadata: { progress }, review, plan: { trialExpiresAt } },isLoading: loadingFirstEnrolledCourseDetail, isFetching: loadingEnrolledCourse
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: 'course',
      id: courseId + ''
    },
    {
      enabled: !!courseId
    }
  )
  const { data: course,isFetching:loadingCourse,isLoading: loadingCourseFirst } = Learner.Queries.useGetCourseDetails(courseId + '')

  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const sections = course.sections

  useEffect(
    () => {
      if (progress >10 && !(review && typeof review !== 'undefined')) {
        setShowReview(true)
      }
    },
    [progress, review]
  )

  useEffect(
    () => {
      if (itemId && sectionId) {
        return navigate(`${itemId}`)
      }
      if (sections[0]?.items[0]) {
        const sectionId = sections[0]._id
        const itemId = sections[0].items[0]._id
        navigate(`${itemId}`)
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
  const currentItem = allItems[currentItemIndex]
  const prevItem = allItems[currentItemIndex - 1]

  const next = () => {
    navigate(`${nextItem._id}`)
  }

  const prev = () => {
    navigate(`${prevItem._id}`)
  }

  useEffect(
    () => {
      if (itemId && sectionId && courseId) {
        // const currentTime = playerInstance?.currentTime
        // console.log(currentTime, 'currentTime')
        updateProgress({
          courseId: courseId + '',
          sectionId: sectionId + '',
          action: 'LAST_PLAYED',
          itemId: itemId,
          data: {
            // time: currentTime
          }
        })
      }
    },
    [itemId, sectionId, courseId]
  )
  const { isMobile,isTablet,isDesktop} = useBreakpoint();
  const items = sections.map(i => i.items).flat();
  const showTrialBanner = useMemo(
    () =>
    trialExpiresAt?  Utils.isTrialExpiringSoon(trialExpiresAt, {
        value: 1,
        unit: 'day'
      }):false,
    [trialExpiresAt]
  );

  const isFetching = loadingEnrolledCourse || loadingCourse;
  const CourseNavigator=<> 
{(loadingCourseFirst || loadingFirstEnrolledCourseDetail)?<>
        <Skeleton.Input block />
  <PlayerSkeleton />
      <PlayerSkeleton />
      <PlayerSkeleton />
      {/* <PlayerSkeleton/> */}
    </> : <>
    <Search
  value={searchText}
  placeholder="Search in course.."
  onChange={e => setSearchText(e.target.value)}
  size="large"
  style={{ marginBottom: 20 }}
        />
        <CoursePlayerCollapsible
      isMobile={isMobile || isTablet}
  searchText={searchText}
  courseId={course._id}
  toggleItemCheck={toggleItemCheck}
    /></>}
   
  </>
  return (
    <PlayerContainer>
      {showTrialBanner ? (
        <Alert
          style={{ textAlign: 'center' }}
          message="Your trial is about to expire"
          banner
        />
      ) : null}
      <ActionModal width={800} open={showReview}>
        <ReviewCourse course={course} />
      </ActionModal>
      <CustomHeader
        className="page-header"
        // bgColor="black"
        title={
          <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
            <OrgLogo
              onClick={() => navigate('../app/store')}
              // style={{ width: 60 }}
            />
            <Divider type="vertical" />
            {!isMobile?<Text style={{ fontSize: 16 }}>{course.title}</Text>:null}
          </Space>
        }
        subTitle={<Text style={{ fontSize: 20 }}>{course.title}</Text>}
        style={{ padding: 0, borderBottom: '1px solid #cac7c7' }}
        extra={[
          !isDesktop?<ActionDrawer
          cta={isMobile?<Button shape='circle' icon={<PlayCircleOutlined />} />:<Button  icon={<PlayCircleOutlined />} >Show Playlist</Button>}
        >
         {CourseNavigator}
        </ActionDrawer>:null
        ]}
      />{' '}
      <Row
        style={{ padding: '20px 10px'}}
        gutter={[10, 40]}
        justify="space-between"
      >
        <Col lg={18} md={24} sm={24} xs={24}>
          <Row>
            <Col span={24}>
              <div
                style={{
                  height: 550,
                  padding: 0,
                  position: 'relative',
                  background: '#fff'
                  // overflow: 'scroll'
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
                <Outlet context={[items, course._id]} />
              </div>
            </Col>
            <Col span={24}>
              <Card style={{ marginTop: 30 }}>
                <CoursePlayerMoreInfo itemId={itemId+''} course={course} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={0} sm={0} xs={0}>
         {CourseNavigator}
        </Col>
      </Row>
    </PlayerContainer>
  )
}

export default CoursePlayer
