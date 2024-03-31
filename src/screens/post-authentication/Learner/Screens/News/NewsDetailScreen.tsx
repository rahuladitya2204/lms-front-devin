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
  Tag
} from 'antd'
import {
  CloudOutlined,
  DotChartOutlined,
  DribbbleOutlined,
  EditOutlined,
  GlobalOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons'
import { Constants, Learner } from '@adewaskar/lms-common'
import { NavLink, useSearchParams } from '@Router/index'
import { Text, Title } from '@Components/Typography/Typography'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@Router/index'

import AudioPlayer from '@Components/AudioPlayer'
import Header from '@Components/Header'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import OrgLogo from '@Components/OrgLogo'
import PDFViewer from '@Components/PDFViewer'
import Tabs from '@Components/Tabs'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'

const { confirm } = Modal

export default function NewsDetailScreen() {
  const [params, setParams]: any[] = useSearchParams()
  // console.log(params, 'lsls;l')
  const paramsDate = params.get('date')
  // const paramsLang = params.get('language')
  const [date, setDate] = useState(dayjs().startOf('day'))
  useEffect(
    () => {
      if (paramsDate) {
        const parsedDate = dayjs(paramsDate)
        if (parsedDate.isValid()) {
          setDate(parsedDate.startOf('day'))
        } else {
          // Handle invalid date format by redirecting or setting a default date
        }
      } else {
        const newDate = dayjs()
          .startOf('day')
          .toISOString()
        setParams({ date: newDate })
      }
    },
    [paramsDate, setParams]
  )

  // When setting the new date from the DatePicker
  const handleDateChange = (dateValue: any) => {
    const newDate = dateValue
      ? dateValue.startOf('day').toISOString()
      : dayjs()
          .startOf('day')
          .toISOString()
    setParams({ date: newDate })
  }

  const { id } = useParams()
  const navigate = useNavigate()
  const { data: newsItem, isLoading } = Learner.Queries.useGetNewsItem(
    date.toISOString()
  )

  const { isMobile, isDesktop } = useBreakpoint()
  // if (!newsItem) {
  //   return <Title>News not uploaded</Title>
  // }

  return (
    <Header
      title={`Welcome to Nimble Bee News Headquarters`}
      extra={[
        <div style={{ marginTop: 5 }}>
          <Button
            onClick={() => {
              confirm({
                title: `Are you sure?`,
                // icon: <ExclamationCircleOutlined />,
                content: `You want to exit?`,
                onOk() {
                  navigate('/')
                },
                okText: 'Exit'
              })
            }}
            icon={<LogoutOutlined />}
            type="primary"
            danger
          >
            Exit
          </Button>
        </div>
      ]}
    >
      <Row>
        <Col sm={1} md={2} xs={0} />
        <Col xs={24} md={20} sm={22}>
          <Card bodyStyle={{ minHeight: 600 }}>
            <Row>
              <Col span={6}>
                <Form.Item label="Select Date">
                  {/* @ts-ignore */}
                  <DatePicker
                    value={date}
                    style={{ width: 200 }}
                    onChange={dateValue => handleDateChange(dateValue)}
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
                <Tabs
                  tabPosition="top"
                  items={[
                    {
                      label: 'Articles',
                      key: 'articles',
                      children: (
                        <Row gutter={[20, 30]}>
                          <Col span={24}>
                            <Tabs
                              tabPosition="top"
                              tabBarStyle={{ marginLeft: 0 }}
                              items={NEWS_CATEGORIES.map(cat => {
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
                                          style={{ textAlign: 'center' }}
                                          level={3}
                                        >
                                          {cat.icon} {cat.title}
                                        </Title>
                                        {newsItem.articles
                                          .filter(i =>
                                            i?.category?.includes(cat.title)
                                          )
                                          .map(article => (
                                            <Col span={24}>
                                              <Card
                                                style={{ marginBottom: 20 }}
                                                title={
                                                  <Text>{article.title}</Text>
                                                }
                                                // extra={article.category.map(c => <Tag color="blue">{c}</Tag>)}
                                              >
                                                {/* @ts-ignore */}
                                                <Text>
                                                  {article?.text['eng']}
                                                </Text>
                                              </Card>
                                            </Col>
                                          ))}
                                      </Col>
                                    </Row>
                                  )
                                }
                              })}
                            />
                          </Col>
                        </Row>
                      )
                    }
                    // {
                    //   label: 'Summary',
                    //   key: 'summary',
                    //   children: <Row>
                    //   <Col span={24}>
                    //   </Col>
                    // {newsItem?<>  <Col span={24}>
                    //   </Col>
                    //   <Col span={24}>
                    //     <Row gutter={[20, 20]}>
                    //       {newsItem.summary.map(item => {
                    //         return (
                    //           <Col span={24}>
                    //             <Card bodyStyle={{paddingTop:0}} title={item.title}>
                    //               <List
                    //                 dataSource={item.items}
                    //                 renderItem={r => <Title level={5}>{r}</Title>}
                    //               />
                    //             </Card>
                    //           </Col>
                    //         )
                    //       })}
                    //     </Row>
                    //           </Col>
                    //       </>:<Title>News not uploaded</Title>}
                    // </Row>
                    //         },
                    // {
                    //   label: 'Read News Paper',
                    //   key: 'view-paper',
                    //   children: (
                    //     <Row>
                    //       <Col span={24}>
                    //         {newsItem?.file ? (
                    //           <PDFViewer file={{ _id: newsItem?.file?.file }} />
                    //         ) : null}
                    //       </Col>
                    //     </Row>
                    //   )
                    // }
                  ]}
                />
              ) : (
                <Title style={{ textAlign: 'center' }}>
                  News not curated yet..
                </Title>
              )}
            </Spin>
          </Card>
        </Col>
        <Col sm={1} md={2} xs={0} />
      </Row>
    </Header>
  )
}

const NEWS_CATEGORIES = [
  {
    title: 'National News',
    icon: <LineChartOutlined />
  },
  {
    title: 'International News',
    icon: <GlobalOutlined />
  },
  {
    title: 'Economy and Business',
    icon: <MoneyCollectOutlined />
  },
  {
    title: 'Science and Technology',
    icon: <DotChartOutlined />
  },
  {
    title: 'Environment and Ecology',
    icon: <CloudOutlined />
  },
  {
    title: 'Sports',
    icon: <DribbbleOutlined />
  },
  {
    title: 'Editorials and Opinions',
    icon: <EditOutlined />
  }
]
