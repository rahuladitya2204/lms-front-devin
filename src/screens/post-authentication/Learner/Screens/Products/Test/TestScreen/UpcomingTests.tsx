import {
  Anchor,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Skeleton,
  Tag,
} from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Learner, Types, Utils } from "@adewaskar/lms-common";

import Image from "@Components/Image";
import { Link } from "@Router/index";
import NoItemFound from "@Components/NoItemFound";
import { SkeletonTestCard } from "./PastTests";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import { useNavigate } from "@Router/index";

const { Meta } = Card;
const { Text, Title } = Typography;

function UpcomingTest(props: { filter: Types.GetTestsFilter }) {
  const navigate = useNavigate();
  const {
    data,
    isFetching: loading,
    isLoading: loadingFirst,
  } = Learner.Queries.useGetEnrolledProductList("test");
  if (loading) {
    const SkeletonArr = [1, 1, 1, 1, 1, 1, 1, 1];
    return (
      <Row gutter={[20, 30]}>
        {SkeletonArr.map(() => (
          <Col xs={24} sm={12} md={8} lg={6}>
            <SkeletonTestCard />
          </Col>
        ))}
      </Row>
    );
  }
  const upcomingTests = data.filter((pd) => {
    return !(pd.product?.data?.endedAt || pd.metadata.test.endedAt);
  });

  if (!upcomingTests.length && !loadingFirst) {
    return (
      <NoItemFound
        cta={"Check them out!"}
        text="No upcoming tests. Lets get enrolled for one!"
      />
    );
  }
  return (
    <Row gutter={[20, 30]}>
      {/* @ts-ignore */}
      {upcomingTests.map(
        ({
          product: { data: test },
          package: bundle,
        }: {
          product: { data: Types.Test };
        }) => {
          const formattedDuration = test?.duration?.enabled
            ? Utils.formatTime(test?.duration.value * 60)
            : null;
          const CardComponent = (
            <Card
              hoverable
              onClick={() => {
                // @ts-ignore
                navigate(`/app/test/${test?._id}`);
              }}
              // style={{ width: 300 }}
              // @ts-ignore
              cover={
                <Image
                  alt={test.title}
                  height={200}
                  src={test.thumbnailImage}
                />
              }
              actions={
                [
                  // <Button block>View Result</Button>
                ]
              }
            >
              <Meta
                // avatar={
                //   <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                // }
                title={
                  <Text>
                    {/* @ts-ignore */}
                    {test.title}{" "}
                    {test?.live?.enabled ? (
                      <Tag color="cyan">Live Test</Tag>
                    ) : null}{" "}
                  </Text>
                }
                description={
                  <>
                    {formattedDuration ? (
                      <Tag
                        color="orange-inverse"
                        icon={<ClockCircleOutlined />}
                      >
                        {formattedDuration}
                      </Tag>
                    ) : null}
                    {test?.live?.scheduledAt ? (
                      <Text>
                        Date: {dayjs(test?.live?.scheduledAt).format("LL")}
                      </Text>
                    ) : (
                      ""
                    )}
                    {bundle ? (
                      <>
                        {" "}
                        <Divider />
                        {bundle ? <PackageText id={bundle} /> : null}
                      </>
                    ) : null}
                  </>
                }
                avatar={<CalendarOutlined />}
              />
            </Card>
          );
          return (
            // @ts-ignore
            <Col xs={24} sm={12} md={8} lg={6}>
              {" "}
              {test?.product?.data?.live?.enabled ? (
                <Badge.Ribbon text="live">{CardComponent}</Badge.Ribbon>
              ) : (
                CardComponent
              )}
            </Col>
          );
        }
      )}
    </Row>
  );
}
export default UpcomingTest;

const PackageText = ({ id }: { id: string }) => {
  const { data: bundle, isLoading: loadingPackage } =
    Learner.Queries.useGetPackageDetails(id);
  // @ts-ignore
  return loadingPackage ? (
    <Skeleton.Button block />
  ) : (
    <Link
      title={bundle.title}
      onClick={(e) => {
        window.open(`/app/test-series/${id}/enrolled-package`);
        e.stopPropagation();
      }}
    >
      {bundle.title}
    </Link>
  );
};
