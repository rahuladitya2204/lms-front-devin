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
  Typography
} from 'antd'
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
  UserSwitchOutlined
} from '@ant-design/icons'
import { Enum, Learner, Utils } from '@adewaskar/lms-common'
import { useNavigate, useParams } from 'react-router'

import Image from '@Components/Image'
import PlayIcon from '@Icons/play.svg'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'

// @ts-nocheck

const { Title, Text } = Typography
const { Content } = Layout

interface EnrolledPackageDetailScreenPropsI {
  //   packageId: string;
}

const EnrolledPackageDetailScreen: React.FC<
  EnrolledPackageDetailScreenPropsI
> = props => {
  const navigate = useNavigate()
  const { packageId } = useParams()
  const {
    data: { product: { data: packageData }, plan: { expiresAt } }
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: Enum.ProductType.PACKAGE,
      id: packageId + ''
    },
    {
      enabled: !!packageId
    }
  )
  // console.log(packageData, 'packageData')
  // const { data: bundle } = Learner.Queries.useGetPackageDetails(packageId + '')

  const { isMobile, isTablet } = useBreakpoint()
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Card size="small" title={null}>
              <Row>
                <Col lg={18} md={18} sm={24} xs={24}>
                  <Title style={{ marginTop: 0 }}>{packageData?.title}</Title>
                  {/* <Progress
                    style={{ padding: 0 }}
                    percent={progress}
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                    format={() => null}
                  /> */}
                  <Row gutter={[30, 10]}>
                    {packageData?.course?.length ? (
                      <Col sm={12} xs={24} md={8} lg={5}>
                        <FundProjectionScreenOutlined />
                        <Text strong> {packageData?.course.length} Tests</Text>
                      </Col>
                    ) : null}
                    {packageData?.test?.length ? (
                      <Col sm={12} xs={24} md={8} lg={5}>
                        <EditOutlined />{' '}
                        <Text strong>{packageData?.test.length} Tests</Text>
                      </Col>
                    ) : null}
                    {packageData?.event?.length ? (
                      <Col sm={12} xs={24} md={8} lg={5}>
                        <CalendarOutlined />{' '}
                        <Text strong> {packageData?.event.length} Events</Text>
                      </Col>
                    ) : null}

                    {expiresAt ? (
                      <Col sm={12} xs={24} md={8} lg={5}>
                        <CalendarOutlined />{' '}
                        <Text strong>{dayjs(expiresAt).format('LLL')}</Text>
                      </Col>
                    ) : null}
                  </Row>
                </Col>
                <Col span={1} />
                <Col lg={5} md={5} sm={0} xs={0}>
                  <Image
                    style={{ borderRadius: 5 }}
                    src={packageData?.thumbnailImage}
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
              <Row gutter={[30, 30]}>
                <Col lg={17} md={24} sm={24} xs={24}>
                  <Row gutter={[20, 30]}>
                    {packageData?.products
                      ? Object.keys(packageData?.products).map(k => {
                          if (!packageData.products[k]?.length) {
                            return null
                          }
                          // @ts-ignore
                          return (
                            <Col span={24}>
                              <Title level={3} style={{ marginTop: 0 }}>
                                {capitalize(k)}
                              </Title>
                              <List
                                split={false}
                                size="small"
                                bordered={false}
                                dataSource={packageData.products[k]}
                                renderItem={(item: any) => (
                                  <List.Item>
                                    <Card
                                      style={{
                                        width: '100%',
                                        borderRadius: 10
                                      }}
                                      bodyStyle={{ padding: 0 }}
                                    >
                                      <Row>
                                        <Col span={3}>
                                          <Image
                                            height={70}
                                            width={100}
                                            src={item.metadata?.thumbnailImage}
                                          />
                                        </Col>
                                        <Col span={1} />
                                        <Col
                                          flex={1}
                                          style={{
                                            marginTop: 10,
                                            marginBottom: 10
                                          }}
                                        >
                                          <Title
                                            style={{ marginTop: 0 }}
                                            level={5}
                                          >
                                            {item.title}
                                          </Title>
                                          <Space>
                                          </Space>
                                        </Col>
                                        <Col span={6} />
                                        <Col
                                          span={3}
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
                                              // style={{ padding: '0 10px' }}
                                              shape="circle"
                                              // onClick={() =>
                                              //   playItem(section._id, item._id)
                                              // }
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
                          )
                        })
                      : null}
                  </Row>
                </Col>
                {/* <Col span={1} /> */}
                <Col lg={7} md={0} sm={0} xs={0}>
                  <Row>
                    <Col span={24}>
                      <Title level={5}>Package Description</Title>
                      <Text>{packageData?.description}</Text>

                      <Divider />
                    </Col>
                    <Col span={24}>
                      <Title level={5} style={{ marginTop: 0 }}>
                        Package Details
                      </Title>
                      <Space direction="vertical">
                        <Text>
                          <UserSwitchOutlined />{' '}
                          {/* {formatAvgCount(packageData.analytics.enrolled.count)}{' '} */}
                          Learners
                        </Text>
                        <Text>
                          <CalendarOutlined />
                          {'  '}
                          {/* @ts-ignore */}
                          {dayjs(packageData.updatedAt).format(
                            'MMMM D, YYYY'
                          )}{' '}
                          last updated
                        </Text>
                        <Text>
                          <GlobalOutlined />
                          {'  '}
                          {/* @ts-ignore */}
                          {packageData.language || 'English'}
                        </Text>
                        {/* {packageData.certificate ? (
                          <Text>
                            <SafetyCertificateOutlined />
                            {'  '}
                            Certificate of completion
                          </Text>
                        ) : null} */}
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

export default EnrolledPackageDetailScreen
