import { Avatar, Badge, Card, Space, Tag, Tooltip } from "@Lib/index";
import {
  BarChartOutlined,
  EyeOutlined,
  FormatPainterOutlined,
  InfoCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Enum, Types } from "@adewaskar/lms-common";

import Image from "@Components/Image";
import { capitalize } from "lodash";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import { Link, useNavigate } from "@Router/index";

interface TestCardProps {
  test: Types.Test;
}

const TestCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`;

function TestCard({ test }: TestCardProps) {
  const navigate = useNavigate();
  const ThumbnailImage = (
    <Image
      alt={test.title}
      height={200}
      alt="example"
      src={test.thumbnailImage}
    />
  );
  return (
    <TestCardHolder
      // bodyStyle={{ height: 115 }}
      hoverable
      cover={
        test.live.enabled ? (
          <Badge.Ribbon
            color="orange"
            text={`Live: ${dayjs(test.live.scheduledAt).format("LLL")}`}
          >
            {ThumbnailImage}
          </Badge.Ribbon>
        ) : (
          ThumbnailImage
        )
      }
      actions={[
        <Link to={`${test._id}/editor`}>
          <InfoCircleOutlined />
        </Link>,
        <Tooltip placement="bottom" title={"Go to Tests builder"}>
          <ToolOutlined onClick={() => navigate(`${test._id}/builder`)} />
        </Tooltip>,
        <Tooltip placement="bottom" title={"Analysis"}>
          <BarChartOutlined
            onClick={() => {
              navigate(`${test._id}/status`);
            }}
          />
        </Tooltip>,
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta
        description={
          <Space>
            <Tag color="blue">Enrolled: {test.analytics.enrolled.count}</Tag>
          </Space>
        }
        // avatar={<Avatar src={user?.image} />}
        title={test.title || ""}
      />
    </TestCardHolder>
  );
}

export default TestCard;
