import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  FloatButton,
  Layout,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'
import {
  CalendarOutlined,
  CheckCircleFilled,
  FileOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  PlayCircleTwoTone,
  SafetyCertificateOutlined,
  StepForwardOutlined,
  UserSwitchOutlined
} from '@ant-design/icons'
// @ts-nocheck
import { Learner, Utils } from '@adewaskar/lms-common'
import {
  formatAvgCount,
  formatSeconds
} from '@User/Screens/Courses/CourseBuilder/utils'
import { useNavigate, useParams } from 'react-router'

import Image from '@Components/Image'
import PlayIcon from '@Icons/play.svg'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Content } = Layout

interface EnrolledCourseDetailScreenPropsI {
  //   courseId: string;
}

const EnrolledCourseDetailScreen: React.FC<
  EnrolledCourseDetailScreenPropsI
> = props => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const {
    data: { course, progress, completed, lastPlayed }
  } = Learner.Queries.useGetEnrolledCourseDetails(courseId + '')

  const { data: instructor } = Learner.Queries.useGetInstructorDetails(
    course.instructor + ''
  )

  const continueLearning = () => {
    navigate(
      `../../courses/${lastPlayed.course}/player/section/${
        lastPlayed.section
      }/item/${lastPlayed.item}`
    )
  }

  const playItem = (sectionId: string, itemId: string) => {
    navigate(
      `../../courses/${courseId}/player/section/${sectionId}/item/${itemId}`
    )
  }

  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Card size="small" title={null}>
              <Row>
                <Col span={18}>
                  <Title style={{ marginTop: 0 }}>{course.title}</Title>
                  <Row justify="space-between">
                    <Col>
                      <Space align="start">
                        <Avatar
                          style={{ marginBottom: 20 }}
                          //   @ts-ignore
                          src={instructor.image}
                        >
                          {/* @ts-ignore */}
                        </Avatar>
                        {/* @ts-ignore  */}
                        {instructor.name}
                      </Space>
                    </Col>
                    <Col>
                      <Button
                        onClick={continueLearning}
                        icon={<PlayCircleOutlined />}
                        type="primary"
                      >
                        Continue Learning
                      </Button>
                    </Col>
                  </Row>
                  <Progress
                    style={{ padding: 0 }}
                    percent={progress}
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                    format={() => null}
                  />
                  <Row gutter={[30, 10]}>
                    <Col>
                      <FundProjectionScreenOutlined />{' '}
                      <Text strong>
                        {completed.length}/{course.totalItems} Lessons
                      </Text>
                    </Col>

                    <Col>
                      <FundProjectionScreenOutlined />{' '}
                      <Text strong>
                        {completed.length}/{course.totalItems} Lessons
                      </Text>
                    </Col>

                    <Col>
                      <FundProjectionScreenOutlined />{' '}
                      <Text strong>
                        {completed.length}/{course.totalItems} Lessons
                      </Text>
                    </Col>

                    <Col>
                      <FundProjectionScreenOutlined />{' '}
                      <Text strong>
                        {completed.length}/{course.totalItems} Lessons
                      </Text>
                    </Col>
                  </Row>
                </Col>
                <Col span={1} />
                <Col span={5} style={{ display: 'flex' }}>
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
            <Card bordered={false} style={{ width: '100%', marginTop: 50 }}>
              <Row>
                <Col span={16}>
                  {course.sections.map(section => {
                    return (
                      <Col span={24}>
                        <Title level={3} style={{ marginTop: 0 }}>
                          {section.title}
                        </Title>
                        <List
                          split={false}
                          size="small"
                          bordered={false}
                          dataSource={section.items}
                          renderItem={item => (
                            <List.Item>
                              <Card
                                style={{ width: '100%', borderRadius: 10 }}
                                bodyStyle={{ padding: 0 }}
                              >
                                <Row>
                                  <Col span={3}>
                                    <Image
                                      height={70}
                                      width={100}
                                      src={item.metadata?.thumbnail}
                                    />
                                  </Col>
                                  <Col span={1} />
                                  <Col
                                    span={10}
                                    style={{ marginTop: 10, marginBottom: 10 }}
                                  >
                                    <Title style={{ marginTop: 0 }} level={5}>
                                      {item.title}
                                    </Title>
                                    <Space>
                                      <Tag>
                                        <StepForwardOutlined
                                          style={{ marginRight: 3 }}
                                        />
                                        {Utils.formatSeconds(
                                          item.metadata?.duration || 0
                                        )}
                                      </Tag>
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
                                  <Col span={6} />
                                  <Col
                                    span={4}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <Space>
                                      <Progress
                                        style={{
                                          visibility: item.isCompleted
                                            ? 'visible'
                                            : 'hidden'
                                        }}
                                        width={32}
                                        type="circle"
                                        percent={100}
                                      />
                                      <Button
                                        style={{ padding: '0 10px' }}
                                        shape="round"
                                        onClick={() =>
                                          playItem(section._id, item._id)
                                        }
                                        // shape="round"
                                        icon={
                                          <img
                                            style={{ width: 11 }}
                                            src={PlayIcon}
                                          />
                                        }
                                      />
                                    </Space>
                                  </Col>
                                </Row>
                              </Card>
                            </List.Item>
                          )}
                        />
                      </Col>
                    )
                  })}
                </Col>
                <Col span={1} />
                <Col span={7}>
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
                          <UserSwitchOutlined />{' '}
                          {formatAvgCount(course.analytics.enrolled.total)}{' '}
                          Learners
                        </Text>
                        <Text>
                          <CalendarOutlined />
                          {'  '}
                          {/* @ts-ignore */}
                          {dayjs(course.updatedAt).format('MMMM D, YYYY')} last
                          updated
                        </Text>
                        <Text>
                          <GlobalOutlined />
                          {'  '}
                          {/* @ts-ignore */}
                          {course.language || 'English'}
                        </Text>
                        {course.certificate ? (
                          <Text>
                            <SafetyCertificateOutlined />
                            {'  '}
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
  )
}

export default EnrolledCourseDetailScreen
