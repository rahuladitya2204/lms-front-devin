import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Empty,
  Row,
  Select,
  Spin,
} from "antd";
import { Constants, Enum, Learner, Types } from "@adewaskar/lms-common";

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
import useBreakpoint from "@Hooks/useBreakpoint";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { capitalize } from "lodash";
import FileList from "@Components/FileList";

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
  const generateLink = (source: string) => {
    setCopy(true);
    setTimeout(() => setCopy(false), 5000);
    copyToClipboard(url + `&utm_source=${source}`);
  };
  const promotionFiles = product?.promotion?.files;
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
            <Col span={12}>
              <Dropdown
                menu={{
                  items: Constants.UTM_SOURCES.map((item) => ({
                    key: item.value,
                    label: `Copy ${capitalize(item.label)} Link`,
                    onClick: () => generateLink(item.value),
                  })),
                }}
              >
                <Button
                  type={copy ? "primary" : "default"}
                  style={{
                    width: "100%",
                    display: "block",
                  }}
                  icon={copy ? <CheckOutlined /> : <CopyOutlined />}
                  // onClick={generateLink}
                  // size="small"
                  block
                >
                  {copy ? "Link Copied" : "Copy Link"}
                </Button>
              </Dropdown>
            </Col>
            <Col span={12}>
              <Button
                onClick={() => {
                  openModal(
                    <AffiliateProductAnalytics
                      product={{
                        type: props.type,
                        id: product._id + "",
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
            {promotionFiles?.length ? (
              <Col span={24}>
                <Button
                  onClick={() => {
                    openModal(
                      <FileList
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                        type="card"
                        files={promotionFiles}
                      />,
                      {
                        title: "Promotion Content",
                        width: 800,
                      }
                    );
                  }}
                  block
                  style={{ marginTop: 10 }}
                  type="dashed"
                  danger
                >
                  Promotion Content
                </Button>
              </Col>
            ) : null}
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
            <Col xs={24} sm={12} md={12} lg={8}>
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
  const [selectedLevel, setSelectedLevel] = useState<string>("level_1"); // Preselect 'level_1'
  const { data, isLoading } = Learner.Queries.useGetAffiliateProductAnalytics({
    dateRange: dates,
    product: product,
  });
  const { isMobile } = useBreakpoint();

  const getColorForLevel = (level) => {
    const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ffbf00", "#00c49f"]; // Add more colors for more levels if needed
    return colors[level - 1] || "#000"; // Default to black if color is not available
  };

  // Define the levels that should always be displayed in the dropdown
  const predefinedLevels = [
    "level_1",
    "level_2",
    "level_3",
    "level_4",
    "level_5",
  ];

  // Use levels from the data if available, otherwise fallback to predefined levels
  const levels = predefinedLevels;

  const handleLevelChange = (value) => {
    setSelectedLevel(value); // Set the selected level
  };

  // Filter data based on the selected level
  const filteredData = selectedLevel
    ? data.map((entry) => ({
        ...entry,
        levels: { [selectedLevel]: entry.levels[selectedLevel] }, // Only keep the selected level in the data
      }))
    : data; // If no level is selected, show all levels

  // Define formatter for the tooltip
  const tooltipFormatter = (value, name) => {
    // Check if the name contains 'Earnings', then format with the rupee symbol
    if (name.includes("Earnings")) {
      return `₹ ${value}`;
    }
    return value; // Return without Rupee symbol for non-earnings fields (like orders)
  };

  return (
    <Row>
      <Col span={24}>
        <Card
          title="Product Analytics"
          extra={
            <>
              <Select
                style={{ width: 200, marginRight: 10 }}
                placeholder="Select Level"
                onChange={handleLevelChange}
                value={selectedLevel || undefined}
              >
                {levels.map((level) => (
                  <Select.Option key={level} value={level}>
                    {level.replace("_", " ")}{" "}
                    {/* Display level as Level 1, Level 2 */}
                  </Select.Option>
                ))}
              </Select>
              <DatePicker.RangePicker
                presets={rangePresets}
                value={dates}
                onChange={setDates}
              />
            </>
          }
        >
          {isMobile ? (
            <Table loading={isLoading} dataSource={filteredData}>
              <TableColumn
                title="Date"
                dataIndex="date"
                render={(
                  _: any,
                  record: {
                    date: string;
                  }
                ) => {
                  return dayjs(record.date).format("LL");
                }}
              />

              {selectedLevel ? (
                <>
                  <TableColumn
                    title={`Total Orders (${selectedLevel.replace("_", " ")})`}
                    dataIndex={["levels", selectedLevel, "totalOrders"]}
                    key={`totalOrders_${selectedLevel}`}
                  />
                  <TableColumn
                    title={`Total Earnings (${selectedLevel.replace(
                      "_",
                      " "
                    )})`}
                    dataIndex={["levels", selectedLevel, "totalEarnings"]}
                    key={`totalEarnings_${selectedLevel}`}
                    render={(
                      _: any,
                      record: {
                        levels: {
                          [key: string]: { totalEarnings: number };
                        };
                      }
                    ) => {
                      return record.levels[selectedLevel]?.totalEarnings
                        ? `₹ ${Math.ceil(
                            record.levels[selectedLevel].totalEarnings
                          )}`
                        : "-";
                    }}
                  />
                </>
              ) : (
                <>
                  {levels.map((level) => (
                    <>
                      <TableColumn
                        title={`Total Orders (${level})`}
                        dataIndex={["levels", level, "totalOrders"]}
                        key={`totalOrders_${level}`}
                      />
                      <TableColumn
                        title={`Total Earnings (${level})`}
                        dataIndex={["levels", level, "totalEarnings"]}
                        key={`totalEarnings_${level}`}
                        render={(
                          _: any,
                          record: {
                            levels: {
                              [key: string]: { totalEarnings: number };
                            };
                          }
                        ) => {
                          return record.levels[level]?.totalEarnings
                            ? `₹ ${Math.ceil(
                                record.levels[level].totalEarnings
                              )}`
                            : "-";
                        }}
                      />
                    </>
                  ))}
                </>
              )}
            </Table>
          ) : (
            <div style={{ height: 600 }}>
              <ResponsiveContainer width={"100%"}>
                <LineChart
                  data={filteredData} // Pass the filtered earnings data to the chart
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
                    formatter={tooltipFormatter} // Format tooltip values
                    labelFormatter={(label) => `${dayjs(label).format("LL")}`} // Show date in the tooltip
                  />
                  <Legend verticalAlign="top" height={36} />

                  {/* Dynamically render lines for the selected level */}
                  {selectedLevel ? (
                    <>
                      <Line
                        key={selectedLevel}
                        type="monotone"
                        dataKey={`levels.${selectedLevel}.totalOrders`}
                        stroke={getColorForLevel(1)} // Assign color
                        activeDot={{ r: 8 }}
                        dot={{ r: 4 }}
                        name={`Total Orders`}
                      />
                      <Line
                        key={selectedLevel}
                        type="monotone"
                        dataKey={`levels.${selectedLevel}.totalEarnings`}
                        stroke={getColorForLevel(2)} // Assign color
                        activeDot={{ r: 8 }}
                        dot={{ r: 4 }}
                        name={`Total Earnings`}
                      />
                    </>
                  ) : (
                    <>
                      {levels.map((level, index) => (
                        <Line
                          key={level}
                          type="monotone"
                          dataKey={`levels.${level}.totalOrders`}
                          stroke={getColorForLevel(index + 1)} // Assign color based on level
                          activeDot={{ r: 8 }}
                          dot={{ r: 4 }}
                          name={`Total Orders`}
                        />
                      ))}
                      {levels.map((level, index) => (
                        <Line
                          key={level}
                          type="monotone"
                          dataKey={`levels.${level}.totalEarnings`}
                          stroke={getColorForLevel(index + 1)} // Assign color based on level
                          activeDot={{ r: 8 }}
                          dot={{ r: 4 }}
                          name={`Total Earnings`}
                        />
                      ))}
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};
