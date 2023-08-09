import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'
import { ClockCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Collapse,
  Progress,
  Row,
  Tag,
  Timeline,
  Typography
} from 'antd'
import dayjs from 'dayjs'
import { i } from 'mathjs'
import { useMemo } from 'react'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router'

interface LiveTestPlayerPropsI {}

const { Title } = Typography

export default function LiveTestPlayer(props: LiveTestPlayerPropsI) {
  const { testId } = useParams()
  const navigate = useNavigate()
  const { data: liveTest } = Learner.Queries.useGetLiveTestDetails(testId + '')
  const endTime = useMemo(
    () =>
      liveTest.scheduledAt
        ? dayjs(liveTest.scheduledAt)
            .add(liveTest.duration, 'minutes')
            .toISOString()
        : '',
    [testId]
  )
  // const currentQuestion=
  return (
    <Header
      title={liveTest.title}
      extra={[
        <Tag icon={<ClockCircleOutlined />} color="blue">
          <Countdown targetDate={endTime} />
        </Tag>,
        <Button type="primary">Finish Test</Button>
      ]}
    >
      <Row>
        <Col span={1} />
        <Col span={22}>
          <Row gutter={[20, 30]}>
            <Col span={8}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <Card>Midterm Test</Card>
                </Col>
                <Col span={24}>
                  <Collapse
                    bordered={false}
                    defaultActiveKey={liveTest.sections.map(e => e._id)}
                  >
                    {liveTest.sections.map(section => {
                      return (
                        <Collapse.Panel
                          extra={<Tag>{section.items.length} Questions</Tag>}
                          key={section._id}
                          header={section.title}
                        >
                          <Timeline
                            items={section.items.map(question => {
                              return {
                                children: (
                                  <div onClick={() => navigate(question._id)}>
                                    {question.title}
                                  </div>
                                ),
                                // dot: <CheckCircleOutlined />,
                                color: 'blue'
                              }
                            })}
                          />
                        </Collapse.Panel>
                      )
                    })}
                  </Collapse>
                </Col>
              </Row>
            </Col>
            <Col span={16}>
              <Title
                level={5}
                style={{
                  textAlign: 'center',
                  display: 'block',
                  margin: 0,
                  marginBottom: 10
                }}
              >
                15 Questions Left
                <Progress strokeLinecap="butt" percent={75} format={() => ``} />
              </Title>

              <Card>
                <Outlet />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1} />
      </Row>
    </Header>
  )
}
