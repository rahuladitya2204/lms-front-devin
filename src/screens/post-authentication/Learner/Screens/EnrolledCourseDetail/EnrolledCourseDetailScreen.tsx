import {
  Avatar,
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
} from "@Lib/index";
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

const { Title, Text } = Typography;
const { Content } = Layout;

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

  const playItem = (sectionId: string, itemId: string) => {
    navigate(`/app/courses/${courseId}/player`);
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
                  <Row justify="space-between">
                    {/* <Col>
                      <Space align="start">
                        <Avatar
                          style={{ marginBottom: 20 }}
                          src={user.image}
                        />
                        <Text style={{ position: "relative", top: 4 }}>
                          {user.name}
                        </Text>
                      </Space>
                    </Col> */}
                    <Col
                      // xs={24}
                      flex={1}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {lastPlayed ? (
                        <Button
                          onClick={continueLearning}
                          icon={<PlayCircleOutlined />}
                          type="primary"
                        >
                          Continue Learning
                        </Button>
                      ) : (
                        <Button
                          size={isMobile ? "large" : "middle"}
                          block={isMobile}
                          onClick={() => {
                            playItem(
                              course.sections[0]._id,
                              course.sections[0].items[0]._id
                            );
                          }}
                          icon={<PlayCircleOutlined />}
                          type="primary"
                        >
                          Start Learning
                        </Button>
                      )}
                    </Col>
                  </Row>
                  <Progress
                    style={{ padding: 0 }}
                    percent={progress}
                    strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                    format={() => null}
                  />
                  <Row gutter={[30, 10]}>
                    <Col sm={12} xs={24} md={8} lg={5}>
                      <FundProjectionScreenOutlined />{" "}
                      <Text strong>
                        {completed.length}/{course.totalItems} Lessons
                      </Text>
                    </Col>

                    <Col sm={12} xs={24} md={8} lg={5}>
                      <EditOutlined />{" "}
                      <Text strong>{notes.length} Notes Taken</Text>
                    </Col>

                    <Col sm={12} xs={24} md={8} lg={5}>
                      <ClockCircleOutlined />{" "}
                      <Text strong>{watchTime} Mins Watched</Text>
                    </Col>

                    {expiresAt ? (
                      <Col sm={12} xs={24} md={8} lg={5}>
                        <CalendarOutlined />{" "}
                        <Text strong>{dayjs(expiresAt).format("LLL")}</Text>
                      </Col>
                    ) : null}
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
                <Col lg={17} md={24} sm={24} xs={24}>
                  <Row gutter={[20, 30]}>
                    {course.sections.map((section) => {
                      return (
                        <Col span={24}>
                          <Title level={3} style={{ marginTop: 0 }}>
                            {section.title.text[defaultLanguage]}
                          </Title>
                          <List
                            split={false}
                            size="small"
                            bordered={false}
                            dataSource={section.items}
                            renderItem={(item) => (
                              <List.Item>
                                <Card
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
                                      flex={1}
                                      style={{
                                        marginTop: 10,
                                        marginBottom: 10,
                                      }}
                                    >
                                      <Title
                                        ellipsis={{ rows: 1 }}
                                        style={{ marginTop: 0 }}
                                        level={5}
                                      >
                                        {item.title.text[defaultLanguage]}
                                      </Title>
                                      <Space>
                                        <Tag color="orange-inverse">
                                          <StepForwardOutlined
                                            style={{ marginRight: 3 }}
                                          />
                                          {Utils.formatSeconds(
                                            item.metadata?.duration || 0
                                          )}
                                        </Tag>
                                        {/* {item.metadata.length ? (
                                          <Tag color='blue-inverse'>
                                            <FileOutlined
                                              style={{ marginRight: 3 }}
                                            />
                                            {item.metadata.length}
                                          </Tag>
                                        ) : null} */}
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
                                    {/* <Col span={6} /> */}
                                    <Col
                                      span={3}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Space>
                                        <Progress
                                          style={{
                                            visibility: item.isCompleted
                                              ? "visible"
                                              : "hidden",
                                          }}
                                          width={32}
                                          type="circle"
                                          percent={100}
                                        />
                                        <Button
                                          // style={{ padding: '0 10px' }}
                                          shape="circle"
                                          type="primary"
                                          onClick={() =>
                                            playItem(section._id, item._id)
                                          }
                                          // shape="round"
                                          icon={<PlayCircleOutlined />}
                                        />
                                      </Space>
                                    </Col>
                                  </Row>
                                </Card>
                              </List.Item>
                            )}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
                {/* <Col span={1} /> */}
                <Col lg={7} md={0} sm={0} xs={0}>
                  <Row>
                    <Col span={24}>
                      <Title level={5}>Course Description</Title>
                      <Text>{course.description}</Text>

                      <Divider />
                    </Col>
                    <Col span={24}>
                      <Title level={5} style={{ marginTop: 0 }}>
                        Course Details
                      </Title>
                      <Space direction="vertical">
                        <Text>
                          <UserSwitchOutlined />{" "}
                          {formatAvgCount(course.analytics.enrolled.count)}{" "}
                          Learners
                        </Text>
                        <Text>
                          <CalendarOutlined />
                          {"  "}
                          {/* @ts-ignore */}
                          {dayjs(course.updatedAt).format("MMMM D, YYYY")} last
                          updated
                        </Text>
                        <Text>
                          <GlobalOutlined />
                          {"  "}
                          {/* @ts-ignore */}
                          {course.language || "English"}
                        </Text>
                        {course.certificate ? (
                          <Text>
                            <SafetyCertificateOutlined />
                            {"  "}
                            Certificate of completion
                          </Text>
                        ) : null}
                      </Space>
                    </Col>
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
