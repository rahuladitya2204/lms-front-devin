import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Dropdown,
    Image,
    List,
    Progress,
    Row,
    Space,
    Tag,
    message,
} from "antd";
import {
    BookOutlined,
    CheckCircleOutlined,
    CheckOutlined,
    VerifiedOutlined,
} from "@ant-design/icons";
import { Enum, Learner, Types } from "@adewaskar/lms-common";

import { Fragment } from "react";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { Link, useNavigate } from "@Router/index";
import { LogEvent } from "@ServerHooks/useDehydration";
import ShowSyllabus from "@Components/ShowSyllabus";
import { useModal } from "@Components/ActionModal/ModalContext";

const { Title, Text } = Typography;

interface EnrolledCourseItemPropsI {
    enrolledProduct: Types.EnrolledProductDetails;
}

export default function EnrolledCourseItem(props: EnrolledCourseItemPropsI) {
    const enrolledCourse = props.enrolledProduct;
    const course = enrolledCourse.product.data as Types.Course;
    const { data: category } = Learner.Queries.useGetProductCategoryDetails(
        course.category + ""
    );
    const navigate = useNavigate();
    const { isMobile, isDesktop, isTablet } = useBreakpoint();

    const { openModal } = useModal();
    return (
        <List.Item style={{ paddingLeft: 0, paddingRight: 0 }} className={`enrolled-${props.enrolledProduct.product.type}-item`}>
            <Card
                hoverable
                // onClick={() => window.open(`../../course/${course._id}`)}
                style={{
                    width: "100%",
                    borderRadius: 10,
                }}
                bodyStyle={{ padding: 10 }}
            >
                <Row gutter={[10, 10]}>
                    <Col
                        flex={1}
                        xs={24}
                        style={{
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Row>
                            <Col span={24}>
                                <Title
                                    style={{
                                        marginTop: 0,
                                        maxWidth: isMobile || isTablet ? 300 : "auto",
                                    }}
                                    level={5}
                                >
                                    {course.title}
                                </Title>
                            </Col>
                        </Row>
                        <Row align="middle">
                            {/* <Col>
                                <Button className="show-syllabus-button" type='dashed' icon={<BookOutlined />} onClick={() => {
                                    openModal(<ShowSyllabus product={{ type: Enum.ProductType.COURSE, id: course._id }} />, {
                                        title: 'Course Syllabus'
                                    })
                                }} size='small'>Show Syllabus</Button>

                                <Divider type="vertical" />
                            </Col> */}
                            <Col>
                                {course.duration.enabled ? (
                                    <Tag color="blue-inverse">{course.duration.value} mins</Tag>
                                ) : null}
                            </Col>
                        </Row>
                        <Space />
                    </Col>
                    <Col
                        // @ts-ignore
                        xs={isMobile ? 24 : null}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: isMobile ? 0 : 10,
                        }}
                    >
                        <Row
                            gutter={[10, 10]}
                            style={{ width: "100%", flex: 1 }}
                            justify={"end"}
                        >
                            <Col xs={24} sm={12}>
                                <Button
                                    style={{
                                        width: isMobile ? "100%" : 100,
                                        marginRight: isMobile ? 0 : null,
                                    }}
                                    onClick={() =>
                                        navigate(`/app/course/${course.slug || course._id}`)
                                    }
                                    block={!isDesktop}
                                >
                                    View Details
                                </Button>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Link
                                    className='start-course-button'
                                    to={`/app/course/${course._id}/player`}
                                    onClick={() => {
                                        LogEvent(
                                            "Course",
                                            "Start Course::Clicked",
                                            `${course.title}}`,
                                            {
                                                courseId: course._id,
                                                clickedFrom: "EnrolledCourseItem",
                                            }
                                        );
                                    }}
                                >
                                    <Button style={{ paddingRight: 15 }}
                                        type="primary"
                                        block={!isDesktop}
                                    // onClick={() => navigate()}
                                    // size='small'
                                    >
                                        Access Course
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </List.Item>
    );
}
