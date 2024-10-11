import { Button, Card, Col, DatePicker, Empty, Row, Spin } from "antd";
import { Enum, Learner, Types } from "@adewaskar/lms-common";

import AppImage from "@Components/Image";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import Tabs from "@Components/Tabs";
import { Typography } from "@Components/Typography";
import { copyToClipboard } from "@Utils/index";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useModal } from "@Components/ActionModal/ModalContext";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { rangePresets } from "./AffiliateScreen";

const { Text } = Typography;
export default function AffiliateProducts() {
  const tabs = [];
  tabs.push(
    {
      label: "Test Series",
      key: "test-series",
      children: <ProductList type="package" />,
    }
    // {
    //   label: 'Events',
    //   key: 'events',
    //   children: <ProductList type="event" />
    // },
    // {
    //   label: 'Courses',
    //   key: 'courses',
    //   children: <ProductList type="course" />
    // }
  );

  return <Tabs tabKey="products" type="card" items={tabs} />;
}

interface ProductCardPropsI {
  product: Types.ProductItem;
  type: string;
}

export const ProductCard = (props: ProductCardPropsI) => {
  const [copy, setCopy] = useState(false);
  const { product } = props;
  const { data: affiliateDetails } =
    Learner.Queries.useGetAffiliateAccountDetails();
  const type = useMemo(() => {
    switch (props.type) {
      case "package":
        return "test-series";
      case "course":
        return "course";
      case "event":
        return "event";
      default:
        return "test";
    }
  }, [props.type]);
  //   @ts-ignore
  const url = `${window.location.host}/${type}/${
    product.slug || product._id
  }?ref=${
    // @ts-ignore
    affiliateDetails._id
  }`;
  const generateLink = () => {
    setCopy(true);
    setTimeout(() => setCopy(false), 5000);
    copyToClipboard(url);
  };
  const { openModal } = useModal();
  return (
    <Card
      bodyStyle={{ padding: "20px 10px" }}
      cover={
        <AppImage height={80} alt="example" src={product.thumbnailImage} />
      }
    >
      <Card.Meta
        description={
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Button
                type={copy ? "primary" : "default"}
                block
                icon={copy ? <CheckOutlined /> : <CopyOutlined />}
                onClick={generateLink}
                // size="small"
              >
                {copy ? "Link Copied" : "Copy Link"}
              </Button>
            </Col>
            <Col span={24}>
              <Button
                onClick={() => {
                  openModal(
                    <AffiliateProductAnalytics
                      product={{
                        type: props.type,
                        id: product._id,
                      }}
                    />,
                    {
                      width: 900,
                      title: `Your earnings for ${product.title}`,
                    }
                  );
                }}
                type="primary"
                block
              >
                View Analytics
              </Button>
            </Col>
          </Row>
        }
        title={<Text>{product.title}</Text>}
      />
    </Card>
  );
};

export const ProductList = (props: {
  //   products: Types.ProductItem[],
  type: string;
}) => {
  const { data: products, isLoading: loadingProducts } =
    Learner.Queries.useGetProducts(props.type);

  return (
    <Spin spinning={loadingProducts}>
      {!loadingProducts && products.length === 0 ? (
        <Empty />
      ) : (
        <Row gutter={[20, 30]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={12} lg={6}>
              <ProductCard type={props.type} product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Spin>
  );
};

export const AffiliateProductAnalytics = (props: {
  product: Types.Product;
}) => {
  const { product } = props;
  const [dates, setDates] = useState([dayjs().startOf("month"), dayjs()]);
  const { data } = Learner.Queries.useGetAffiliateProductAnalytics({
    dateRange: dates,
    product: product,
  });
  console.log(data, "ddddd");
  return (
    <Row>
      <Col span={24}>
        <Card
          title="Product Analytics"
          extra={
            <DatePicker.RangePicker
              presets={rangePresets}
              value={dates}
              onChange={setDates}
            />
          }
        >
          <div style={{ height: 600 }}>
            <ResponsiveContainer width={"100%"}>
              <LineChart
                data={data} // Pass the earnings data to the chart
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date">
                  <Label value="Date" offset={-10} position="insideBottom" />
                </XAxis>
                <YAxis>
                  <Label
                    value="Earnings/Orders"
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
                <Tooltip
                  formatter={(value) => `₹${value}`} // Format tooltip values as Rupee currency
                  labelFormatter={(label) => `Date: ${label}`} // Show date in the tooltip
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="totalOrders"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  dot={{ r: 4 }}
                  name="Total Orders"
                />
                <Line
                  type="monotone"
                  dataKey="totalEarnings"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                  dot={{ r: 4 }}
                  name="Total Earnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
