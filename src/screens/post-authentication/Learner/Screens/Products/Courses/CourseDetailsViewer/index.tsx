import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Rate,
  Row,
  Skeleton,
  Tag,
  Typography
} from 'antd';
import {
  AlertOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Constants, Store, Types, Utils } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal';
import CourseDetails from './CourseDetails'
import CourseMetadata from './CourseMetadata'
import Image from '@Components/Image'
import { Learner } from '@adewaskar/lms-common'
import LearnerLogin from '@Learner/Screens/Login';
import { LoginLearner } from '@adewaskar/lms-common/lib/cjs/types/Learner/Api';
import ProductCheckoutButton from '@Components/CheckoutButton';
import { formatAvgCount } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils';
import image from './bg.svg'
import styled from '@emotion/styled'
import useMessage from '@Hooks/useMessage';

const { UnitTypeToStr } = Utils;

const { Title, Text, Paragraph } = Typography

const ThumbnailSkeleton = styled(Skeleton.Image)`
.ant-skeleton-image{
  width: 100%;
  height: 20px;
}
.ant-skeleton-active{
  display: block !important; 
}
`

const Container = styled.div`
  /* background-image: url(${image}); */
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  /* height: 100vh; */
  padding-top: 20px;
`

const CustomRate = styled(Rate)`
  .ant-rate-star {
    margin-right: 5px;
  }
`

const MetaText = styled(Text)`
`

const CourseTitle = styled(Title)`

`

const CourseSubTitle = styled(Paragraph)`

  font-size: 20px;
`

function CourseDetailViewer () {
  const { id: courseId } = useParams();
  const { data: course,isLoading: loadingCourse } = Learner.Queries.useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  });
  const instructor = course.instructor as unknown as Types.Instructor;
  const plan = course.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  const category = course?.category as unknown as Types.ProductCategory;
  return (
    <Container>
      <Row gutter={[20, 20]} justify="space-between">
        <Col span={24}>
          <Row gutter={[30,30]} style={{lineHeight: 0}} >
            <Col xs={24} sm={24} md={24} lg={16} >
              {loadingCourse ? <Row justify="space-between" align="top" gutter={[20, 20]}>
                <Col span={24}>
                <Skeleton  paragraph={{ rows: 1 }} />

                </Col>
                <Col span={8}>
                  <Skeleton avatar paragraph={{ rows: 1 }} />
                </Col>
                <Col span={8}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </Col>
                <Col span={8}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </Col>
              </Row> :
                <Row justify="space-between" align="top" gutter={[20, 20]}>
          
          <Col span={24}>
                    <Row gutter={[30, 30]}>
                      <Col md={0}>
                        <CourseCard plan={plan} courseId={courseId+''} />
                        {/* Replace with card image */}
                    {/* <CourseMetadata course={course} /> */}
                    </Col>

              <Col span={24}>
                <CourseTitle className="course-title" level={3}>
                  {course.title}
                </CourseTitle>
                <Col span={24} />
                <CourseSubTitle className="course-title">
                  {course.subtitle}
                </CourseSubTitle>
              </Col>
              <Col ></Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={18} md={16} lg={12}>
                <Row justify="start" align="middle" gutter={[20,20]}>
                  <Col>
                    <Avatar
                      size={64}
                      src={instructor?.image || <UserOutlined color="black" />}
                    />
                  </Col>
                  <Col>
                    <MetaText strong>Created By</MetaText> <br />
                    <MetaText>{instructor?.name}</MetaText>
                  </Col>
                </Row>
              </Col>
              <Col xs={0} sm={0} md={0} lg={6}>
                <MetaText strong>Categories</MetaText> <br />
                <MetaText>{category?.title}</MetaText>
              </Col>
              <Col xs={24} sm={6} md={7} lg={6}>
                <MetaText strong>Review</MetaText> <br />
                <CustomRate
                  disabled
                  style={{ fontSize: 15 }}
                  value={course.analytics.reviews.count}
                />{' '}
                    {course.analytics.averageRating}
                    ({formatAvgCount(course.analytics.reviews.count)} reviews)
                <MetaText />
              </Col>
            </Row>
          </Col>
        </Row>}
      

          <Row>
            <Col style={{ marginTop: 15 }} span={24}>
              <CourseDetails course={course} />
            </Col>
          </Row>
        </Col>
        <Col xs={0} sm={0} md={0} lg={8}>
              <CourseCard plan={plan} courseId={courseId+''}>
                <CourseMetadata course={course} />
       </CourseCard>
            </Col></Row>
        </Col>
      </Row>
    </Container>
  )
}

export default CourseDetailViewer


const CourseCard = ({courseId,plan,children}: {
  courseId: string,
  plan: Types.Plan,
  children?:React.ReactNode
}) => {
  const { data: course,isLoading: loadingCourse } = Learner.Queries.useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  });
  const message = useMessage();
  const navigate = useNavigate();

  const { mutate: updateCart,isLoading: addingToCart } = Learner.Queries.useUpdateCartItems()
  const addItemToCart = (course:Types.Course) => {
    updateCart({ data: { product: { type: 'course', id: course._id } }, action: 'add' });
  }
  const { data: {items} } = Learner.Queries.useGetCartDetails();
  const isAddedToCart = items.find((cartItem:Types.CartItem) => cartItem.product.id === course._id);
  const isSignedIn= Store.useAuthentication(s => s.isSignedIn);

  const { data: courses } = Learner.Queries.useGetEnrolledCourses()
  const isEnrolled = !!(courses.find((e) => {
    return e.product.id === courseId;
  }));
  return    <Card
  cover
  bordered hoverable
  style={{ padding: 0 }}
  bodyStyle={{ padding: 5 }}
    >
      {loadingCourse ?
        <>
          <Row gutter={[20, 10]}>
            <Col span={24}>
            <Image  width={'100%'} height={200} preview={false} />
            </Col>
            <Col span={24}>
            <Skeleton.Button block/>
            </Col>
            <Col span={24}>
            <Skeleton.Button block/>
<Skeleton active paragraph={{ rows: 10 }} /> 
            </Col>
        </Row>
        </> : <>  <Row gutter={[20, 10]}>
      <Col span={24}>
        <Image  width={'100%'} height={200} preview={false} src={course.thumbnailImage} />
</Col>
        <Col span={24}>
          <Row justify="space-between" align='middle'>
        <Col>
            <Row align='middle' gutter={[5, 5]}>
              <Col><Text strong style={{ fontSize: 24 }}>{UnitTypeToStr(plan.finalPrice)}</Text></Col>
             <Col><Text style={{ textDecoration: 'line-through' }} type='secondary'>{UnitTypeToStr(plan.displayPrice)}</Text></Col>
          </Row>
        </Col>
        <Col>
          <Tag color="purple">{ Math.floor(Number(plan.discount))}% off</Tag>
        </Col>
      </Row>
    </Col>
      <Col span={24}>
        <Row gutter={[15, 15]}>
        {isSignedIn?<><Col span={24}>
          {!isEnrolled?<Button loading={addingToCart} disabled={!!isAddedToCart} onClick={()=>addItemToCart(course)} size="large" block>
            {isAddedToCart?`Added to cart`:`Add To Cart`}
          </Button>:null}
        </Col>
        <Col span={24}>
         {isEnrolled?   <Button onClick={()=>navigate(`player`)}size="large" type="primary" block>
            Go to Course
                  </Button> :
                      <ProductCheckoutButton
                      onSuccess={() => {
                        message.open({
                          type: 'success',
                          content: `You have enrolled successfully`
                        })
                      }}
                      product={{ type: 'course', id: courseId + '' }}
                      block
                      type="primary"
                    >
                      Enroll Now
                    </ProductCheckoutButton>
          //           <Button onClick={() => enrollForCourse(course._id)} size="large" type="primary" block>
          //   Enroll Now
          // </Button>
                  }
                </Col>{' '}</> :
                <Col span={24}>
                  <ActionModal width={300}
                    cta={<Button size="large" type="primary" block>
            Login to buy this course
                </Button>}>
                  <LearnerLogin/>
          </ActionModal></Col>
            }
            {children? <Col span={24}>
          {children}
        </Col>:null}
       
      </Row>
    
    </Col>
  </Row></>}
      
  {/* </Card> */}
</Card>
}