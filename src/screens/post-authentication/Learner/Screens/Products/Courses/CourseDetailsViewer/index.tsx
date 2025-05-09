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
  Typography,
  message,
} from "antd";
import { AlertOutlined, UserOutlined } from "@ant-design/icons";
import { Constants, Store, Types, Utils } from "@adewaskar/lms-common";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "@Router/index";

import ActionModal from "@Components/ActionModal/ActionModal";
import CourseDetails from "./CourseDetails";
import CourseMetadata from "./CourseMetadata";
import Image from "@Components/Image";
import { Learner } from "@adewaskar/lms-common";
import LearnerLogin from "@Learner/Screens/Login";
import ProductCheckoutButton from "@Components/CheckoutButton";
import { formatAvgCount } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import image from "./bg.svg";
import styled from "@emotion/styled";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import { LogEvent } from "@ServerHooks/useDehydration";

const { UnitTypeToStr } = Utils;

const { Title, Text, Paragraph } = Typography;

const ThumbnailSkeleton = styled(Skeleton.Image)`
  .ant-skeleton-image {
    width: 100%;
    height: 20px;
  }
  .ant-skeleton-active {
    display: block !important;
  }
`;

const Container = styled.div`
  /* background-image: url(${image.src}); */
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  /* height: 100vh; */
  padding-top: 20px;
`;

const CustomRate = styled(Rate)`
  .ant-rate-star {
    margin-right: 5px;
  }
`;

const MetaText = styled(Text)``;

const CourseTitle = styled(Title)``;

const CourseSubTitle = styled(Paragraph)`
  font-size: 20px;
`;

function CourseDetailViewer() {
  const { id: courseId } = useParams();
  const { data: course, isFetching: loadingCourse } =
    Learner.Queries.useGetCourseDetails(courseId + "", {
      enabled: !!courseId,
    });
  const user = course.user as unknown as Types.User;
  const plan =
    (course.plan as unknown as Types.Plan) ||
    Constants.INITIAL_COURSE_PLAN_DETAILS;
  const category = course?.category as unknown as Types.ProductCategory;
  return (
    <Container>
      <Row gutter={[20, 20]} justify="space-between">
        <Col span={24}>
          <Row gutter={[30, 30]} style={{ lineHeight: 0 }}>
            <Col xs={24} sm={24} md={24} lg={16}>
              {loadingCourse ? (
                <Row justify="space-between" align="top" gutter={[20, 20]}>
                  <Col span={24}>
                    <Skeleton paragraph={{ rows: 1 }} />
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
                </Row>
              ) : (
                <Row justify="space-between" align="top" gutter={[20, 20]}>
                  <Col span={24}>
                    <Row gutter={[30, 30]}>
                      <Col lg={0}>
                        <CourseCard plan={plan} courseId={courseId + ""} />
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
                      <Col></Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      {/* <Col xs={24} sm={18} md={16} lg={12}>
                        <Row justify="start" align="middle" gutter={[20, 20]}>
                          <Col>
                            <Avatar
                              size={64}
                              src={
                                user?.image || <UserOutlined color="black" />
                              }
                            />
                          </Col>
                          <Col>
                            <MetaText strong>Created By</MetaText> <br />
                            <MetaText>{user?.name}</MetaText>
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
                        />{" "}
                        {course.analytics.averageRating}(
                        {formatAvgCount(course.analytics.reviews.count)}{" "}
                        reviews)
                        <MetaText />
                      </Col>*/}
                    </Row>
                  </Col>
                </Row>
              )}

              <Row>
                <Col style={{ marginTop: 15 }} span={24}>
                  <CourseDetails course={course} />
                </Col>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={0} lg={8}>
              <CourseCard plan={plan} courseId={courseId + ""}>
                <CourseMetadata course={course} />
              </CourseCard>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CourseDetailViewer;

const CourseCard = ({
  courseId,
  plan,
  isServer,
  children,
}: {
  courseId: string;
  plan: Types.Plan;
  isServer: boolean;
  children?: React.ReactNode;
}) => {
  const product = { type: "course", id: courseId };
  const { data: course, isFetching: loadingCourse } =
    Learner.Queries.useGetCourseDetails(courseId + "", {
      enabled: !!courseId,
    });
  const navigate = useNavigate();

  const { mutate: updateCart, isLoading: addingToCart } =
    Learner.Queries.useUpdateCartItems();
  const addItemToCart = (course: Types.Course) => {
    updateCart({ data: { product: product }, action: "add" });
  };
  const {
    data: { items },
  } = Learner.Queries.useGetCartDetails();
  const isAddedToCart = items.find(
    (cartItem: Types.CartItem) => cartItem.product.id === course._id
  );
  const { isSignedIn } = Store.useAuthentication((s) => s);

  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct(product);

  const isLoading = loadingCourse;
  const { openModal } = useModal();
  return (
    <Card
      cover
      bordered
      hoverable
      style={{ padding: 0 }}
      bodyStyle={{ padding: 5 }}
    >
      {isLoading ? (
        <>
          <Row gutter={[20, 10]}>
            <Col span={24}>
              <Image
                alt="Loading"
                width={"100%"}
                height={200}
                preview={false}
              />
            </Col>
            <Col span={24}>
              <Skeleton.Button block />
            </Col>
            <Col span={24}>
              <Skeleton.Button block />
              <Skeleton active paragraph={{ rows: 10 }} />
            </Col>
          </Row>
        </>
      ) : (
        <>
          {" "}
          <Row gutter={[20, 10]}>
            <Col span={24}>
              <Image
                width={"100%"}
                height={200}
                preview={false}
                src={course.thumbnailImage}
              />
            </Col>
            <Col span={24}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Row align="middle" gutter={[5, 5]}>
                    <Col>
                      <Text strong style={{ fontSize: 24 }}>
                        {UnitTypeToStr(plan.finalPrice)}
                      </Text>
                    </Col>
                    <Col>
                      <Text
                        style={{ textDecoration: "line-through" }}
                        type="secondary"
                      >
                        {UnitTypeToStr(plan.displayPrice)}
                      </Text>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Tag color="purple">
                    {Math.floor(Number(plan.discount))}% off
                  </Tag>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[15, 15]}>
                {isSignedIn ? (
                  <>
                    <Col span={24}>
                      {isEnrolled ? (
                        <Link
                          title={course.title}
                          anchor={isServer}
                          // to={`/app/enrolled-course/${courseId}/enrolled-course`}
                          onClick={() =>
                            navigate(
                              `/app/enrolled-course/${courseId}/enrolled-course`
                            )
                          }
                        >
                          <Button
                            className="go-to-course-button"
                            onClick={() =>
                              window.open(
                                `/app/${courseId}/enrolled-course`
                              )
                            }
                            size="large"
                            type="primary"
                            block
                            id="go-to-course-button"
                          >
                            Go to Course
                          </Button>
                        </Link>
                      ) : (
                        <ProductCheckoutButton
                          className="enroll-now-button"
                          // onClick={() => {
                          //   LogEvent(
                          //     "Enroll Package Button",
                          //     "Click",
                          //     course.title
                          //   );
                          // }}
                          onSuccess={() => {
                            message.open({
                              type: "success",
                              content: `You have enrolled successfully`,
                              // particle: true,
                            });
                            window.open(
                              `/app/${courseId}/enrolled-course`
                            );
                          }}
                          product={{ type: "course", id: courseId + "" }}
                          block
                          type="primary"
                        >
                          Enroll Now
                        </ProductCheckoutButton>
                      )}
                    </Col>{" "}
                  </>
                ) : (
                  <Col span={24}>
                    <Button className='login-to-access-button'
                      onClick={() => {
                        openModal(<LearnerLogin />, {
                          width: 300,
                        });
                      }}
                      size="large"
                      type="primary"
                      block
                    >
                      Login to access this course
                    </Button>
                    {/* <ActionModal width={300}
                cta={<Button size="large" type="primary" block>
        Login to access this course
            </Button>}>
              <LearnerLogin/>
            </ActionModal> */}
                  </Col>
                )}
                {children ? <Col span={24}>{children}</Col> : null}
              </Row>
            </Col>
          </Row>
        </>
      )}

      {/* </Card> */}
    </Card>
  );
};
