import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Layout,
  List,
  Progress,
  Row,
  Space,
  Tag,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  PlayCircleTwoTone,
  SafetyCertificateOutlined,
  StepForwardOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
// @ts-nocheck
import { Learner, Utils } from "@adewaskar/lms-common";
import {
  formatAvgCount,
  formatSeconds,
} from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useNavigate, useParams } from "@Router/index";

import Image from "@Components/Image";
import PlayIcon from "@Icons/play.svg";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import { CourseItemDurationTag } from "../CoursePlayer/CoursePlayerNavigator/CoursePlayerNavigatorItem";
import styled from "styled-components";

const { Title, Text } = Typography;
const { Content } = Layout;

const CustomProgress = styled(Progress)`
.ant-progress-outer {
padding: 0 !important;
}
`
interface EnrolledCourseDetailScreenPropsI {
  //   courseId: string;
}


const EnrolledCourseDetailScreen: React.FC<EnrolledCourseDetailScreenPropsI> = (
  props
) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const {
    data: {
      metadata: { progress, completed, notes, lastPlayed, watchTime },
      plan: { expiresAt },
    },
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: "course",
      id: courseId + "",
    },
    {
      enabled: !!courseId,
    }
  );

  const { data: course } = Learner.Queries.useGetCourseDetails(courseId + "");

  const { user } = course;

  const continueLearning = () => {
    navigate(`/app/courses/${lastPlayed.course}/player/${lastPlayed.item}`);
  };

  const playItem = (itemId: string) => {
    navigate(`/app/courses/${courseId}/player/${itemId}`);
  };

  const { isMobile, isTablet } = useBreakpoint();
  const defaultLanguage = 'eng'
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Card size="small" title={null}>
              <Row>
                <Col lg={18} md={18} sm={24} xs={24}>
                  <Title style={{ marginTop: 0 }}>{course.title}</Title>
                  <CustomProgress
                    style={{ padding: 0 }}
                    percent={progress}
                    strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                    format={() => null}
                  />
                  <Row gutter={[30, 10]}>
                    <Col sm={12} xs={24} md={8} lg={6}>
                      <FundProjectionScreenOutlined />{" "}
                      <Text strong>
                        {completed.length}/{course.totalItems} Lessons
                      </Text>
                    </Col>

                    <Col sm={12} xs={24} md={8} lg={6}>
                      {notes?.length ? <><EditOutlined />{" "}
                        <Text strong>{notes?.length} Notes Taken</Text></> : null}
                    </Col>

                    {/* <Col sm={12} xs={24} md={8} lg={6}>
                      <ClockCircleOutlined />{" "}
                      <Text strong>{watchTime} Mins Watched</Text>
                    </Col> */}

                    <Col sm={12} xs={24} md={8} lg={6}>
                      {expiresAt ? (
                        <>
                          <CalendarOutlined />{" "}
                          <Text strong>{dayjs(expiresAt).format("LLL")}</Text>

                        </>
                      ) : null}
                    </Col>

                    <Col style={{ display: 'flex', justifyContent: 'end' }} sm={12} xs={24} md={8} lg={6}>
                      {completed.length > 1 ? (
                        <Button
                          onClick={continueLearning}
                          icon={<PlayCircleOutlined />}
                          type="primary"
                        >
                          Continue Learning
                        </Button>
                      ) : (
                        <Button
                          size={isMobile ? "large" : "small"}
                          block={isMobile}
                          onClick={() => {
                            playItem(
                              course.sections[0].items[0]._id
                            );
                          }}
                          icon={<PlayCircleOutlined />}
                          type="primary"
                        >
                          Start Learning
                        </Button>
                      )}</Col>
                  </Row>
                </Col>
                <Col span={1} />
                <Col lg={5} md={5} sm={0} xs={0}>
                  <Image
                    style={{ borderRadius: 5 }}
                    src={course.thumbnailImage}
                  />
                </Col>
              </Row>
              <Row />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Card bordered={false} style={{ width: "100%", marginTop: 50 }}>
              <Row gutter={[30, 30]}>
                <Col lg={24} md={24} sm={24} xs={24}>
                  <Row gutter={[20, 30]}>
                    {course.sections.map((section) => {
                      return (
                        <Col span={24}>
                          <Title level={3} style={{ marginTop: 0 }}>
                            {section.title.text[defaultLanguage]}
                          </Title>
                          <List
                            split={false}
                            grid={{
                              gutter: 20,
                              xs: 1,
                              sm: 2,
                              md: 2,
                              lg: 3,
                              xl: 3,
                              xxl: 3
                            }}
                            size="small"
                            bordered={false}
                            dataSource={section.items}
                            renderItem={(item) => {
                              const Component = <Card
                                hoverable
                                onClick={() => {
                                  playItem(item._id)
                                }}
                                style={{ width: "100%", borderRadius: 10 }}
                                bodyStyle={{ padding: "0 20px" }}
                              >
                                <Row gutter={[10, 10]}>
                                  {/* <Col>
                                <Image
                                  height={70}
                                  width={100}
                                  src={item.metadata?.thumbnail}
                                />
                              </Col> */}
                                  {/* <Col span={1} /> */}
                                  <Col
                                    span={24}
                                    style={{
                                      marginTop: 10,
                                      marginBottom: 10,
                                    }}
                                  >
                                    <Title
                                      ellipsis={{ rows: 1 }}
                                      style={{ marginTop: 0, fontSize: 14 }}
                                      level={5}
                                    >
                                      {item.title.text[defaultLanguage]}
                                    </Title>
                                    <Space>
                                      <CourseItemDurationTag item={item} />
                                      {item.files.length ? (
                                        <Tag>
                                          <FileOutlined
                                            style={{ marginRight: 3 }}
                                          />
                                          {item.files.length}
                                        </Tag>
                                      ) : null}
                                    </Space>
                                  </Col>
                                </Row>
                              </Card>
                              return <List.Item>
                                {completed.includes(item._id) ? <Badge.Ribbon color='green-inverse' text='Completed'>{Component}</Badge.Ribbon> : Component}
                              </List.Item>
                            }}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </Col>

              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default EnrolledCourseDetailScreen;
