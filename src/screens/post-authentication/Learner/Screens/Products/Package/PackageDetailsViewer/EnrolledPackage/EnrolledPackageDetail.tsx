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
  Skeleton,
  Space,
  Tag
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
import { Enum, Learner, Utils } from '@invinciblezealorg/lms-common'
import { Fragment, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

import EnrolledTestItem from './EnrolledTestItem'
import Image from '@Components/Image'
import PlayIcon from '@Icons/play.svg'
import Tabs from '@Components/Tabs'
import { Typography } from '@Components/Typography'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'
import { sortBy } from 'lodash'
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
    data: { product: { data: packageData }, plan: { expiresAt }, enrolledAt },
    isLoading: loading
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: Enum.ProductType.PACKAGE,
      id: packageId + ''
    },
    {
      enabled: !!packageId
    }
  )
  const { progress, totalItems, completedItems } = useMemo(
    () => {
      let totalItems = { test: 0, course: 0, event: 0 }
      let completedItems = { test: 0, course: 0, event: 0 }
      // @ts-ignore
      if (!packageData.products) {
        return { totalItems, completedItems, progress: 0 }
      }
      // @ts-ignore
      Object.keys(packageData.products).forEach(k => {
        // @ts-ignore
        packageData.products[k].forEach(product => {
          // @ts-ignore
          totalItems[k] += 1
          if (product.metadata.test.endedAt) {
            // @ts-ignore
            completedItems[k] += 1
          }
        })
      })
      const progress =
        Object.keys(completedItems)
          // @ts-ignore
          .map(k => completedItems[k])
          .reduce((a, b) => a + b, 0) /
        Object.keys(totalItems)
          // @ts-ignore
          .map(k => totalItems[k])
          .reduce((a, b) => a + b, 0) *
        100
      // @ts-ignore
      return {
        progress,
        totalItems,
        completedItems
      }
    },
    [packageData]
  )
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const PackageDetailSkel = isDesktop ? [1, 1, 1, 1, 1, 1] : [1, 1]
  console.log(packageData, progress, 'packageData')
  // console.log(packageData, 'packageData')
  // const { data: bundle } = Learner.Queries.useGetPackageDetails(packageId + '')
  const skelArr = isDesktop ? [1, 1, 1, 1, 1] : [1, 1]
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Card size="small" title={null}>
              <Row>
                <Col lg={18} md={18} sm={24} xs={24}>
                  {loading ? (
                    <Row gutter={[20, 30]}>
                      <Col span={24}>
                        <Skeleton.Button
                          active
                          style={{
                            width: '100%',
                            height: 30

                            // marginBottom: 20
                          }}
                        />
                      </Col>
                      <Col span={24}>
                        <Skeleton.Button
                          active
                          style={{ width: '100%', height: 8 }}
                        />
                      </Col>
                      <Col span={24}>
                        <Row justify={'space-between'}>
                          {skelArr.map(() => (
                            <Col>
                              <Skeleton.Button
                                active
                                style={{ height: 15, width: 120 }}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  ) : (
                    <Row gutter={[10, 10]}>
                      <Col span={24}>
                        <Title level={2} style={{ marginTop: 0 }}>
                          {packageData?.title}
                        </Title>
                      </Col>
                      <Col span={24}>
                        <Progress
                          style={{ padding: 0 }}
                          percent={progress || 0}
                          strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                          format={() => null}
                        />
                      </Col>
                      <Col span={24}>
                        <Row>
                          {Object.keys(totalItems).map(key => {
                            //  @ts-ignore
                            if (!totalItems[key]) {
                              return null
                            }
                            return (
                              <Col>
                                <Text strong>
                                  <EditOutlined /> {/* @ts-ignore */}
                                  {completedItems[key]}/{totalItems[key]}{' '}
                                  {capitalize(key)}s Completed
                                </Text>
                              </Col>
                            )
                          })}
                        </Row>
                      </Col>
                    </Row>
                  )}

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
                    {/* 
                    {expiresAt ? (
                      <Col sm={12} xs={24} md={8} lg={5}>
                        <CalendarOutlined />{' '}
                        <Text strong>{dayjs(expiresAt).format('LLL')}</Text>
                      </Col>
                    ) : null} */}
                  </Row>
                </Col>
                <Col span={1} />
                <Col lg={5} md={5} sm={0} xs={0}>
                  {loading ? (
                    <Skeleton.Image
                      active
                      style={{ height: 200, width: '100%' }}
                    />
                  ) : (
                    <Image
                      height={200}
                      style={{ borderRadius: 5 }}
                      src={packageData?.thumbnailImage}
                    />
                  )}
                </Col>
              </Row>
              <Row />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Row gutter={[30, 30]}>
              <Col xl={19} lg={24} md={24} sm={24} xs={24}>
                <Row gutter={[20, 30]}>
                  {loading ? (
                    <Col span={24}>
                      <Skeleton.Button
                        active
                        style={{
                          width: '100%',
                          height: 30,
                          marginBottom: 15,
                          marginTop: 20
                        }}
                      />

                      <Skeleton.Button
                        active
                        style={{ width: '100%', height: 75, marginTop: 18 }}
                      />

                      <Skeleton.Button
                        active
                        style={{ width: '100%', height: 75, marginTop: 18 }}
                      />

                      <Skeleton.Button
                        active
                        style={{ width: '100%', height: 75, marginTop: 18 }}
                      />
                    </Col>
                  ) : packageData?.products ? (
                    <Col span={24}>
                      <Card
                        style={{ marginTop: 20 }}
                        bodyStyle={{ paddingTop: 10 }}
                      >
                        <Tabs
                          navigateWithHash
                          items={Object.keys(packageData?.products)
                            .filter(k => packageData?.products[k].length)
                            .map(k => {
                              return {
                                label: `${capitalize(k)}s`,
                                key: k,
                                children: (
                                  <List
                                    split={false}
                                    size="small"
                                    bordered={false}
                                    dataSource={sortBy(
                                      packageData.products[k],
                                      e => e.metadata.test.endedAt
                                    )}
                                    renderItem={(item: any) => (
                                      <EnrolledTestItem
                                        enrolledProduct={item}
                                      />
                                    )}
                                  />
                                )
                              }
                            })}
                        />
                      </Card>
                    </Col>
                  ) : null}
                </Row>
              </Col>
              {/* <Col span={1} /> */}
              <Col xl={5} lg={0} md={0} sm={0} xs={0}>
                <Row>
                  {/* <Col span={24}>
                      <Title level={5}>Package Description</Title>
                      <Text>{packageData?.description}</Text>

                      <Divider />
                    </Col> */}
                  <Col span={24}>
                    <Card style={{ marginTop: 20 }}>
                      {loading ? (
                        <Row gutter={[0, 10]}>
                          {PackageDetailSkel.map(() => (
                            <Col span={24}>
                              <Skeleton.Button
                                block
                                active
                                style={{
                                  height: 14,
                                  width: '100%',
                                  marginBottom: 10
                                }}
                              />
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <Space direction="vertical">
                          <Text>
                            <CalendarOutlined />
                            {'  '} Enrolled On {'  '}
                            {dayjs(enrolledAt).format('MMMM D, YYYY')}{' '}
                          </Text>
                          {expiresAt ? (
                            <Text>
                              <Divider />
                              <CalendarOutlined />
                              {'  '} Expires At {'  '}
                              {/* @ts-ignore */}
                              {dayjs(expiresAt).format('MMMM D, YYYY')}{' '}
                            </Text>
                          ) : null}
                          {/* <Text>
                          <GlobalOutlined />
                          {'  '}
                          {packageData.language || 'English'}
                        </Text> */}
                          {/* {packageData.certificate ? (
                          <Text>
                            <SafetyCertificateOutlined />
                            {'  '}
                            Certificate of completion
                          </Text>
                        ) : null} */}
                        </Space>
                      )}
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default EnrolledPackageDetailScreen
