import {
  Avatar,
  Badge,
  Card,
  Col,
  Divider,
  Rate,
  Row,
  Space,
  Tag,
} from "@Lib/index";
import {
  BarChartOutlined,
  BookOutlined,
  ClockCircleOutlined,
  EditOutlined,
  RightOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { Constants, Enum, Types } from "@adewaskar/lms-common";

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

interface ProductCategoryCardPropsI {
  productCategory: Types.ProductCategory;
  isServer?: boolean;
}

const CustomCard = styled(Card)`
  cursor: pointer;
  /* margin-left: 30px;
margin-bottom: 20px; */
`;

function ProductCategoryCard(props: ProductCategoryCardPropsI) {
  const { productCategory } = props;
  const isServer = props.isServer;
  const CardComponent = (
    <Link
      title={productCategory.title}
      to={
        // `/category/${productCategory._id}`
        isServer
          ? `/category/${productCategory._id}`
          : `/app/category/${productCategory._id}`
      }
      prefetch={true}
    >
      <Card
        hoverable
        style={{ display: "flex", alignItems: "center" }}
        bodyStyle={{ padding: 0, width: "100%" }}
      >
        <Row gutter={[20, 20]} justify={"space-between"} align={"middle"}>
          <Col>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={productCategory.title}
                src={productCategory.thumbnailImage}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "10px",
                }}
              />
              <p style={{ margin: 0, paddingLeft: "10px", fontWeight: "bold" }}>
                {productCategory.info.isUpcoming ? (
                  <ThunderboltFilled
                    style={{ color: "goldenrod", marginRight: 5 }}
                  />
                ) : null}
                {productCategory.title}
              </p>
            </div>
          </Col>
          <Col style={{ marginRight: 10 }}>
            <RightOutlined />
          </Col>
        </Row>
      </Card>
    </Link>
  );
  return CardComponent;
}

export default ProductCategoryCard;
