import { Badge, Card, Col, Divider, Rate, Row, Space, Tag } from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Constants, Types } from "@adewaskar/lms-common";

import Image from "@Components/Image";
import PriceCardContent from "./PriceCardContent";
import { Typography } from "@Components/Typography";
import { Utils } from "@adewaskar/lms-common";
import { capitalize } from "lodash";
import styled from "@emotion/styled";
import { getIsServer } from "@ServerUtils/index";
import { Link } from "@Router/index";

const { Text } = Typography;

const { UnitTypeToStr } = Utils;

interface PackageCardPropsI {
  package: Types.Package;
  isServer?: boolean;
}

const CustomCard = styled(Card)`
  cursor: pointer;
  /* margin-left: 30px;
margin-bottom: 20px; */
`;

function PackageCard(props: PackageCardPropsI) {
  const { package: bundle } = props;
  const plan =
    (bundle.plan as unknown as Types.Plan) ||
    Constants.INITIAL_COURSE_PLAN_DETAILS;
  const isServer = props.isServer;
  return (
    <Link
      to={isServer ? `/package/${bundle._id}` : `/app/package/${bundle._id}`}
    >
      {/* // <Badge.Ribbon text="Best Seller" color="orange"> */}
      <CustomCard
        hoverable
        bodyStyle={{ padding: 15 }}
        cover={
          <Image
            alt="example"
            style={{ height: 140 }}
            src={bundle.thumbnailImage}
          />
        }
      >
        <Card.Meta
          title={
            <Space size="small" direction="vertical">
              <Text
                ellipsis
                style={{
                  fontSize: 16,
                  whiteSpace: "normal", // Ensures text wraps
                  overflowWrap: "break-word", // Breaks words to prevent overflow
                }}
              >
                {bundle.title}
              </Text>
            </Space>
          }
        />
        <Row justify={"space-between"} style={{ marginTop: 10 }}>
          <Col>
            <Text type="secondary" style={{ fontSize: 13 }}>
              <Tag color="blue-inverse">Bundle</Tag>
              {/* @ts-ignore */}
              {Object.keys(bundle.products)
                .filter((k) => bundle.products[k].length)
                .map((key) => {
                  // @ts-ignore
                  const products = bundle.products[key];
                  return (
                    <Tag key={key} color="orange-inverse">
                      {products.length} {capitalize(key)}s
                    </Tag>
                  );
                })}
            </Text>
          </Col>
        </Row>
        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        <Row justify={"space-between"}>
          <Col span={24}>
            <PriceCardContent plan={plan} />
          </Col>
        </Row>
      </CustomCard>
    </Link>
  );
}

export default PackageCard;
