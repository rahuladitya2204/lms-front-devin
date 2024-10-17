"use client";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Layout,
  List,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Timeline,
} from "@Lib/index";
import {
  CalendarOutlined,
  CheckCircleFilled,
  CheckOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EditOutlined,
  FileOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  PlayCircleTwoTone,
  PrinterOutlined,
  SafetyCertificateOutlined,
  StepForwardOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Enum, Learner, Utils } from "@adewaskar/lms-common";
import { Fragment, useMemo } from "react";
import { useNavigate, useParams } from "@Router/index";

import EnrolledTestItem from "./EnrolledTestItem";
import Image from "@Components/Image";
import Tabs from "@Components/Tabs";
import { Typography } from "@Components/Typography";
import { capitalize } from "lodash";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import useBreakpoint from "@Hooks/useBreakpoint";
import { useModal } from "@Components/ActionModal/ModalContext";
import ActionModal from "@Components/ActionModal/ActionModal";
import OrderAddressForm from "./AddressForm";

// @ts-nocheck

const { Title, Text } = Typography;
const { Content } = Layout;
interface EnrolledPackageDetailScreenPropsI {
  // packageId: string;
}

const EnrolledPackageDetailScreen: React.FC<
  EnrolledPackageDetailScreenPropsI
> = (props) => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const { data: bundle } = Learner.Queries.useGetPackageDetails(
    packageId + "",
    {
      enabled: !!packageId,
    }
  );
  const { mutate: updateOrderAddress } =
    Learner.Queries.useCreateOfflineKitOrder({
      type: Enum.ProductType.PACKAGE,
      id: bundle._id + "",
    });
  const {
    data: {
      product: { data: packageData },
      plan: { expiresAt },
      enrolledAt,
      order: orderId,
    },
    isLoading: loading,
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: Enum.ProductType.PACKAGE,
      id: bundle._id + "",
    },
    {
      enabled: !!bundle._id,
    }
  );
  const { data: order, isLoading: loadingOrder } =
    Learner.Queries.useGetOrderDetails(orderId, {
      enabled: !!orderId,
    });
  const { data: ts } = Learner.Queries.useGetOfflineOrderTrackingStatus(
    orderId,
    {
      enabled: !!orderId,
    }
  );
  const trackingStatus = [
    {
      activity:
        order.offlineKit.delivery.status === "created" ? "Order Received" : "",
      // @ts-ignore
      date: dayjs(order.offlineKit.orderedAt).format("LL"),
    },
    // {
    //   location: "In Progress",
    // },
    ...order.offlineKit.delivery.trackingStatus.scans,
  ];
  // console.log(order, "order");
  // console.log(order, "orderorder");
  // const { openModal } = useModal();
  // console.log(packageData, "packageData");
  const { progress, totalItems, completedItems } = useMemo(() => {
    let totalItems = { test: 0, course: 0, event: 0 };
    let completedItems = { test: 0, course: 0, event: 0 };
    // @ts-ignore
    if (!packageData.products) {
      return { totalItems, completedItems, progress: 0 };
    }
    // @ts-ignore
    Object.keys(packageData.products).forEach((k) => {
      // @ts-ignore
      packageData.products[k].forEach((product) => {
        // @ts-ignore
        totalItems[k] += 1;
        if (product.metadata.test.endedAt) {
          // @ts-ignore
          completedItems[k] += 1;
        }
      });
    });
    const progress =
      (Object.keys(completedItems)
        // @ts-ignore
        .map((k) => completedItems[k])
        .reduce((a, b) => a + b, 0) /
        Object.keys(totalItems)
          // @ts-ignore
          .map((k) => totalItems[k])
          .reduce((a, b) => a + b, 0)) *
      100;
    // @ts-ignore
    return {
      progress,
      totalItems,
      completedItems,
    };
  }, [packageData]);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const PackageDetailSkel = isDesktop ? [1, 1, 1, 1, 1, 1] : [1, 1];
  // const trackingStatus = [
  //   {
  //     location: "Order Received",
  //   },
  //   {
  //     date: "2021-12-23 14:23:18",
  //     status: "X-PPOM",
  //     activity: "In Transit - Shipment picked up",
  //     location: "Palwal_NewColony_D (Haryana)",
  //     "sr-status": "42",
  //   },
  //   {
  //     date: "2021-12-23 14:19:37",
  //     status: "FMPUR-101",
  //     activity: "Manifested - Pickup scheduled",
  //     location: "Palwal_NewColony_D (Haryana)",
  //     "sr-status": "NA",
  //   },
  //   {
  //     date: "2021-12-23 14:19:34",
  //     status: "X-UCI",
  //     activity: "Manifested - Consignment Manifested",
  //     location: "Palwal_NewColony_D (Haryana)",
  //     "sr-status": "5",
  //   },
  //   // {
  //   //   date: "2021-12-23 14:19:34",
  //   //   status: "Delivered",
  //   //   activity: "Manifested - Consignment Manifested",
  //   //   location: "Palwal_NewColony_D (Haryana)",
  //   //   "sr-status": "5",
  //   // },
  // ];
  const DownloadTestKit = !loading ? (
    !order?.offlineKit?.delivery?.status ? (
      <ActionModal
        width={500}
        title="Please Enter your address"
        cta={
          <Button
            style={{ marginTop: 20 }}
            danger
            type="primary"
            size="large"
            block
          >
            <FileOutlined /> Order Offline Kit
          </Button>
        }
      >
        <OrderAddressForm
          onSubmit={(e) => {
            updateOrderAddress({
              address: e,
            });
          }}
          product={{
            id: bundle._id + "",
            type: Enum.ProductType.PACKAGE,
          }}
        />
      </ActionModal>
    ) : (
      <Spin spinning={loadingOrder}>
        <div style={{ marginTop: 20 }}>
          <Collapse defaultActiveKey={["order"]}>
            <Collapse.Panel header="Tracking Offline Kit" key="order">
              <Timeline
                items={trackingStatus.map((status) => {
                  return {
                    children: (
                      <Text>
                        {status.activity} (
                        <Text strong>{dayjs(status.date).format("LL")}</Text>)
                      </Text>
                    ),
                    // dot: dayjs(status.date).format("LL"),
                    // color: trackingStatus.length < 2 ? "blue" : "green",
                    // dot: trackingStatus.length < 2 ? null : <CheckCircleFilled />,
                    // children: status.status,
                  };
                })}
              />
            </Collapse.Panel>
          </Collapse>
        </div>
      </Spin>
    )
  ) : null;
  const EnrolledPackageExtra = (
    <Row>
      <Col span={24}>
        <div>
          {loading ? (
            <Row gutter={[0, 10]}>
              {PackageDetailSkel.map(() => (
                <Col span={24}>
                  <Skeleton.Button
                    block
                    active
                    style={{
                      height: 14,
                      width: "100%",
                      marginBottom: 10,
                    }}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Space direction="vertical">
              {/* <Text>
                <CalendarOutlined />
                {"  "} Enrolled On {"  "}
                {dayjs(enrolledAt).format("MMMM D, YYYY")}{" "}
              </Text> */}
              {expiresAt ? (
                <Text>
                  <Divider style={{ margin: 0 }} />
                  {/* <CalendarOutlined />
              {"  "} Expires At {"  "}
              {dayjs(expiresAt).format("MMMM D, YYYY")}{" "} */}
                </Text>
              ) : null}
            </Space>
          )}

          {bundle?.offlineKit?.enabled ? DownloadTestKit : null}
        </div>
      </Col>
    </Row>
  );
  const RefundBox = order.status.includes("refund") ? (
    <Alert
      showIcon
      style={{ marginBottom: 10 }}
      icon={<DollarOutlined />}
      type="info"
      message="Refund Initiated"
    />
  ) : null;
  const skelArr = isDesktop ? [1, 1, 1, 1, 1] : [1, 1];
  return (
    <Row>
      <Col span={24}>{RefundBox}</Col>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Card size="small" title={null}>
              <Row>
                <Col lg={17} md={17} sm={24} xs={24}>
                  {loading ? (
                    <Row gutter={[20, 30]}>
                      <Col span={24}>
                        <Skeleton.Button
                          active
                          style={{
                            width: "100%",
                            height: 30,

                            // marginBottom: 20
                          }}
                        />
                      </Col>
                      <Col span={24}>
                        <Skeleton.Button
                          active
                          style={{ width: "100%", height: 8 }}
                        />
                      </Col>
                      <Col span={24}>
                        <Row justify={"space-between"}>
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
                          strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                          format={() => null}
                        />
                      </Col>
                      <Col span={24}>
                        <Row>
                          {Object.keys(totalItems).map((key) => {
                            //  @ts-ignore
                            if (!totalItems[key]) {
                              return null;
                            }
                            return (
                              <>
                                <Col>
                                  <Text strong>
                                    <EditOutlined /> {/* @ts-ignore */}
                                    {completedItems[key]}/{totalItems[key]}{" "}
                                    {capitalize(key)}s Completed
                                  </Text>
                                </Col>
                                <Divider type="vertical" />
                                <Col>
                                  <Text>
                                    <CalendarOutlined />
                                    {"  "} Enrolled On {"  "}
                                    {dayjs(enrolledAt).format(
                                      "MMMM D, YYYY"
                                    )}{" "}
                                  </Text>
                                </Col>
                              </>
                            );
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
                        <EditOutlined />{" "}
                        <Text strong>{packageData?.test.length} Tests</Text>
                      </Col>
                    ) : null}
                    {packageData?.event?.length ? (
                      <Col sm={12} xs={24} md={8} lg={5}>
                        <CalendarOutlined />{" "}
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
                <Col lg={6} md={6} sm={0} xs={0}>
                  {loading ? (
                    <Skeleton.Image
                      active
                      style={{ height: 200, width: "100%" }}
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
          <Col xl={0} lg={24} md={24} sm={24} xs={24}>
            {EnrolledPackageExtra}
          </Col>
          <Col span={24}>
            <Row gutter={[30, 30]}>
              <Col xl={19} lg={24} md={24} sm={24} xs={24}>
                <Row gutter={[20, 30]}>
                  {loading ? (
                    <Col span={24}>
                      <Skeleton.Button
                        active
                        style={{
                          width: "100%",
                          height: 30,
                          marginBottom: 15,
                          marginTop: 20,
                        }}
                      />

                      <Skeleton.Button
                        active
                        style={{ width: "100%", height: 75, marginTop: 18 }}
                      />

                      <Skeleton.Button
                        active
                        style={{ width: "100%", height: 75, marginTop: 18 }}
                      />

                      <Skeleton.Button
                        active
                        style={{ width: "100%", height: 75, marginTop: 18 }}
                      />
                    </Col>
                  ) : packageData?.products ? (
                    <Col span={24}>
                      <Card
                        style={{ marginTop: 20 }}
                        bodyStyle={{ paddingTop: 10 }}
                      >
                        <Tabs
                          tabKey="package-detail"
                          items={Object.keys(packageData?.products)
                            .filter((k) => packageData?.products[k].length)
                            .map((k) => {
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
                                      (e) => e.metadata.test.endedAt
                                    )}
                                    renderItem={(item: any) => (
                                      <EnrolledTestItem
                                        enrolledProduct={item}
                                      />
                                    )}
                                  />
                                ),
                              };
                            })}
                        />
                      </Card>
                    </Col>
                  ) : null}
                </Row>
              </Col>
              <Col xl={5} lg={0} md={0} sm={0} xs={0}>
                {EnrolledPackageExtra}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default EnrolledPackageDetailScreen;
