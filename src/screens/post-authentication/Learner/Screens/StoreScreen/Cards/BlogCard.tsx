import { Badge, Card, Col, Divider, Rate, Row, Space, Tag } from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Types } from "@adewaskar/lms-common";

import Image from "@Components/Image";
import PriceCardContent from "./PriceCardContent";
import { Typography } from "@Components/Typography";
import { Utils } from "@adewaskar/lms-common";
import { capitalize } from "lodash";
import styled from "@emotion/styled";
import { useNavigate } from "@Router/index";

const { Text } = Typography;

const { UnitTypeToStr } = Utils;

interface BlogCardPropsI {
  blog: Types.Blog;
  isServer?: boolean;
}

const CustomCard = styled(Card)`
  cursor: pointer;
  /* margin-left: 30px;
margin-bottom: 20px; */
`;

function BlogCard(props: BlogCardPropsI) {
  const { blog } = props;
  const navigate = useNavigate();
  return (
    // <Badge.Ribbon text="Best Seller" color="orange">
    <CustomCard
      hoverable
      onClick={() =>
        navigate(
          props.isServer
            ? `/blog/${blog.slug || blog._id}`
            : `/app/blog/${blog.slug || blog._id}`
        )
      }
      bodyStyle={{ padding: 15 }}
      cover={
        <Image
          alt="example"
          style={{ height: 140 }}
          src={blog.thumbnailImage}
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
              {blog.title}
            </Text>
          </Space>
        }
      />
    </CustomCard>
  );
}

export default BlogCard;
