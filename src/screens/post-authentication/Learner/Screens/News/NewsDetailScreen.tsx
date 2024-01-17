import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  List,
  Modal,
  Row,
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
import { NavLink, useSearchParams } from 'react-router-dom'
import { Text, Title } from '@Components/Typography/Typography'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

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
  useEffect(
    () => {
      // console.log(params,'paor')
      if (paramsDate) {
        setDate(dayjs(paramsDate).startOf('day'))
      } else {
        setParams({
          // @ts-ignore
          date: dayjs()
            .startOf('day')
            .toISOString()
        })
      }
    },
    [paramsDate]
  )
  const { id } = useParams()
  const [date, setDate] = useState(dayjs().startOf('day'))
  const navigate = useNavigate()
  const { data: newsItem, isLoading } = Learner.Queries.useGetNewsItem(
    date.toISOString()
  )
  const { isMobile, isDesktop } = useBreakpoint()
  const ArticleTabs = (
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
                <Title style={{ textAlign: 'center' }} level={3}>
                  {cat.icon} {cat.title}
                </Title>
                {newsItem.articles
                  .filter(i => i.category.includes(cat.title))
                  .map(article => (
                    <Col span={24}>
                      <Card
                        style={{ marginBottom: 20 }}
                        title={<Text>{article.title}</Text>}
                        // extra={article.category.map(c => <Tag color="blue">{c}</Tag>)}
                      >
                        <Text>{article?.text?.eng}</Text>
                      </Card>
                    </Col>
                  ))}
              </Col>
            </Row>
          )
        }
      })}
    />
  )
  return (
    <Header
      title={`News: ${dayjs(newsItem.date).format('LL')}`}
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
            <Form.Item label="Select Date">
              {/* @ts-ignore */}
              <DatePicker
                value={date}
                style={{ width: 150 }}
                onChange={e =>
                  setParams({
                    date: e?.toISOString()
                  })
                }
              />
            </Form.Item>
            <Spin spinning={isLoading}>
              <Tabs
                tabPosition="top"
                items={[
                  {
                    label: 'Articles',
                    key: 'articles',
                    children: (
                      <Row gutter={[20, 30]}>
                        <Col span={24}>{ArticleTabs}</Col>
                      </Row>
                    )
                  },
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
                  {
                    label: 'Read News Paper',
                    key: 'view-paper',
                    children: (
                      <Row>
                        <Col span={24}>
                          {newsItem?.file ? (
                            <PDFViewer file={{ _id: newsItem?.file?.file }} />
                          ) : null}
                        </Col>
                      </Row>
                    )
                  }
                ]}
              />
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
