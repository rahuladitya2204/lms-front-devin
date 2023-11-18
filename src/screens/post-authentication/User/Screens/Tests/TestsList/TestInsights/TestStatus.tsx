import { Alert, Button, Card, Col, Row, Statistic, Tag, Typography } from 'antd'
import { Enum, User } from '@adewaskar/lms-common'
// import UpcomingTest from './UpcomingTest'
import { useNavigate, useParams } from 'react-router'

import BackButton from '@Components/BackButton'
import Header from '@Components/Header'
// import PastTest from './PastTest'
import Tabs from '@Components/Tabs'
import TestAttendedList from './TestAttendedList'
import { UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

const TestStatus = () => {
  const navigate = useNavigate()
  const { testId } = useParams()
  const {
    mutate: evaluateLiveTestResult,
    isLoading: generatingResult
  } = User.Queries.useEvaluateLiveTestResult()
  const { data: test } = User.Queries.useGetTestDetails(testId + '')
  const result = test.result
  // console.log(result, 'result')
  return (
    <Header
      title={
        <span>
          {' '}
          <BackButton onClick={() => navigate('..')} /> Tests:{' '}
          {test.title}
        </span>
      }
      extra={[
        <Button
          onClick={() => {
            evaluateLiveTestResult(testId + '')
          }}
          loading={generatingResult}
          type="primary"
        >
          Generate Result
        </Button>
      ]}
    >
      <Row gutter={[20, 30]}>
        {result ? (
          <Col span={24}>
            <Card
              title={test.title}
              extra={<Tag>{dayjs(test.live.scheduledAt).format('LLL')}</Tag>}
            >
              <Row gutter={[20, 20]}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Total Students"
                      value={result.totalStudents}
                      // precision={2}
                      // valueStyle={{ color: '#3f8600' }}
                      prefix={<UserOutlined />}
                      // suffix="%"
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Average Score"
                      value={result.averageScore}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Absent Students"
                      value={result.absentStudents}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Finished Students"
                      value={result.completedTest}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Passed Students"
                      value={result.totalPassing}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Failed Students"
                      value={result.totalFailed}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        ) : null}
        {/* <Col span={24}>
          <Alert
            message="Exam results arent published yet"
            type="success"
            showIcon
            action={[
              <Button size="small">Publish without feedback</Button>,
              <Button type="primary" style={{ marginLeft: 20 }} size="small">
                Publish with feedback
              </Button>
            ]}
            closable
          />
        </Col> */}
        <Col span={24}>
          <Card>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: 'Attended',
                  label: 'Attended',
                  children: <TestAttendedList />
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Header>
  )
}

export default TestStatus
