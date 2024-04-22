"use client";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  List,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tag,
} from "@Lib/index";
import {
  CloudOutlined,
  DotChartOutlined,
  DribbbleOutlined,
  EditOutlined,
  GlobalOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { Learner } from "@adewaskar/lms-common";
import { useSearchParams } from "@Router/index";
import { Text, Title } from "@Components/Typography/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@Router/index";

import AudioPlayer from "@Components/AudioPlayer";
import Header from "@Components/Header";
import Tabs from "@Components/Tabs";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";

const { confirm } = Modal;

interface NewsDetailScreenPropsI {
  date?: string;
}

export default function NewsDetailScreen(props: NewsDetailScreenPropsI) {
  const { date: paramDate } = useParams();
  const [date, setDate] = useState(() => {
    if (paramDate) {
      const parsedDate = dayjs(paramDate);
      if (parsedDate.isValid()) {
        return parsedDate.startOf("day");
      }
    }
    return dayjs().startOf("day");
  });

  useEffect(() => {
    if (paramDate) {
      const parsedDate = dayjs(paramDate);
      console.log(parsedDate, paramdate, "pod");
      if (parsedDate.isValid()) {
        setDate(parsedDate.startOf("day"));
      }
    }
  }, [paramDate]);

  const navigate = useNavigate();

  // When setting the new date from the DatePicker
  const handleDateChange = (dateValue: any) => {
    const newDate = dateValue
      ? dateValue.startOf("day").toISOString()
      : dayjs().startOf("day").toISOString();
    navigate(`/news/${newDate}`);
  };

  const { data: newsItem, isLoading } = Learner.Queries.useGetNewsItem(
    date.startOf("day").toISOString()
  );

  const { isMobile, isDesktop, width } = useBreakpoint();
  return (
    <Header
      title={`Welcome to Testmint.ai News Headquarters`}
      extra={[
        <div style={{ marginTop: 5 }}>
          <Button
            onClick={() => {
              confirm({
                title: `Are you sure?`,
                // icon: <ExclamationCircleOutlined />,
                content: `You want to exit?`,
                onOk() {
                  navigate("/");
                },
                okText: "Exit",
              });
            }}
            icon={<LogoutOutlined />}
            type="primary"
            danger
          >
            Exit
          </Button>
        </div>,
      ]}
    >
      <Row>
        <Col sm={1} md={2} xs={0} />
        <Col xs={24} md={20} sm={22}>
          <Card bodyStyle={{ minHeight: 600 }}>
            <Row>
              <Col xs={24} sm={6}>
                <Form.Item label={!isMobile ? "Choose Date" : null}>
                  {/* @ts-ignore */}
                  <DatePicker
                    value={date}
                    style={{ width: isMobile ? "100%" : 200 }}
                    onChange={(dateValue) => handleDateChange(dateValue)}
                  />
                </Form.Item>
              </Col>
              {newsItem?.audio?.url ? (
                <Col span={24}>
                  <Divider />
                  <Title level={3}>Play News</Title>
                  <AudioPlayer
                    // @ts-ignore
                    src={newsItem?.audio?.url}
                    // preview
                  />
                  <Divider />
                </Col>
              ) : null}
              {/* <Col span={6}>
                <Form.Item label="Select Language">
                  <Select
                    value={lang}
                    style={{ width: 150 }}
                    onChange={e =>
                      setParams({
                        date: date?.toISOString(),
                        lang: e
                      })
                    }
                    options={[
                      {
                        label: 'English',
                        value: 'eng'
                      },
                      {
                        label: 'Hindi',
                        value: 'hin'
                      }
                    ]}
                  />
                </Form.Item>
              </Col> */}
            </Row>
            <Spin spinning={isLoading}>
              {newsItem ? (
                <Row gutter={[20, 30]}>
                  <Col span={24}>
                    <Tabs
                      tabPosition="top"
                      tabBarStyle={{
                        marginLeft: 0,
                        width: width < 400 ? 300 : "100%",
                      }}
                      items={NEWS_CATEGORIES.map((cat) => {
                        return {
                          label: (
                            <Text>
                              {cat.icon} {isDesktop ? cat.title : null}
                            </Text>
                          ),
                          key: cat.title,
                          children: (
                            <Row>
                              <Col span={24}>
                                <Title
                                  style={{ textAlign: "center" }}
                                  level={3}
                                >
                                  {cat.icon} {cat.title}
                                </Title>
                                {newsItem.articles
                                  .filter((i) =>
                                    i?.category?.includes(cat.title)
                                  )
                                  .map((article) => (
                                    <Col span={24}>
                                      <Card
                                        style={{ marginBottom: 20 }}
                                        title={<Text>{article.title}</Text>}
                                        // extra={article.category.map(c => <Tag color="blue">{c}</Tag>)}
                                      >
                                        {/* @ts-ignore */}
                                        <Text>{article?.text["eng"]}</Text>
                                      </Card>
                                    </Col>
                                  ))}
                              </Col>
                            </Row>
                          ),
                        };
                      })}
                    />
                  </Col>
                </Row>
              ) : (
                <Title style={{ textAlign: "center" }}>
                  News not curated yet..
                </Title>
              )}
            </Spin>
          </Card>
        </Col>
        <Col sm={1} md={2} xs={0} />
      </Row>
    </Header>
  );
}

const NEWS_CATEGORIES = [
  {
    title: "National News",
    icon: <LineChartOutlined />,
  },
  {
    title: "International News",
    icon: <GlobalOutlined />,
  },
  {
    title: "Economy and Business",
    icon: <MoneyCollectOutlined />,
  },
  {
    title: "Science and Technology",
    icon: <DotChartOutlined />,
  },
  {
    title: "Environment and Ecology",
    icon: <CloudOutlined />,
  },
  {
    title: "Sports",
    icon: <DribbbleOutlined />,
  },
  {
    title: "Editorials and Opinions",
    icon: <EditOutlined />,
  },
];
