import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'
import { CheckCircleOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Collapse, Row, Tag, Timeline } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useParams } from 'react-router'

interface LiveTestPlayerPropsI {}

const Sections = [
  {
    title: 'Beginner Level',
    questions: [
      { title: 'sdfsdfsdfsfdsdf' },
      { title: 'sdfsdfsdfsfdsdf' },
      { title: 'sdfsdfsdfsfdsdf' }
    ]
  },
  {
    title: 'Medium Level',
    questions: [
      { title: 'sdfsdfsdfsfdsdf' },
      { title: 'sdfsdfsdfsfdsdf' },
      { title: 'sdfsdfsdfsfdsdf' }
    ]
  },
  {
    title: 'Advanced Level',
    questions: [
      { title: 'sdfsdfsdfsfdsdf' },
      { title: 'sdfsdfsdfsfdsdf' },
      { title: 'sdfsdfsdfsfdsdf' }
    ]
  }
]

export default function LiveTestPlayer(props: LiveTestPlayerPropsI) {
  const { testId } = useParams()
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
  const TimeLinez = (
    <Timeline
      items={[
        {
          children: 'Create a services site 2015-09-01'
        },
        {
          children: 'Solve initial network problems 2015-09-01'
        },
        {
          children: 'Technical testing 2015-09-01'
        },
        {
          children: 'Network problems being solved 2015-09-01'
        }
      ]}
    />
  )
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
        <Col span={2} />
        <Col span={20}>
          <Row>
            <Col span={8}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <Card>Midterm Test</Card>
                </Col>
                <Col span={24}>
                  <Collapse>
                    {Sections.map(section => {
                      return (
                        <Collapse.Panel
                          key={section.title}
                          header={section.title}
                        >
                          <Timeline
                            items={section.questions.map(question => {
                              return {
                                children: question.title,
                                dot: <CheckCircleOutlined />,
                                color: 'green'
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
          </Row>
        </Col>
        <Col span={2} />
      </Row>
    </Header>
  )
}
