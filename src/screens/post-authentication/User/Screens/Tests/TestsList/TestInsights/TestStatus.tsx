import { Alert, Button, Card, Col, Dropdown, Modal, Row, Skeleton, Statistic, Tag } from 'antd'
import { CloseOutlined, UserOutlined } from '@ant-design/icons'
import { Enum, User } from '@adewaskar/lms-common'
// import UpcomingTest from './UpcomingTest'
import { useNavigate, useParams } from 'react-router'

import BackButton from '@Components/BackButton'
import Header from '@Components/Header'
// import PastTest from './PastTest'
import Tabs from '@Components/Tabs'
import TestAttendedList from './TestAttendedList'
import TestEnrolledList from './EnrolledList'
import { Typography } from '@Components/Typography'
import dayjs from 'dayjs'
import { printPdf } from '@Components/SunEditor/utils'

const { confirm } = Modal;

const TestStatus = () => {
  const navigate = useNavigate()
  const { testId } = useParams()
  const {
    mutate: evaluateLiveTestResult,
    isLoading: generatingResult
  } = User.Queries.useEvaluateLiveTestResult()
  const { data: test, isLoading: loadingTest } = User.Queries.useGetTestDetails(testId + '')
  const { mutate: printResults,isLoading: printingResult } = User.Queries.usePrintTestResult(testId + '')
  const result = test.result.metrics;
  const SkelArr = [1, 1, 1, 1, 1, 1];
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
            confirm({
              title: `Are you sure, you want to genarate the results`,
              // icon: <ExclamationCircleOutlined />,
              // content: `Money will be deducted from your wallet`,
              onOk() {
                evaluateLiveTestResult(testId + '')
              },
              okText: 'Generate Result'
            })
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
              {loadingTest ? <Row gutter={[20, 20]}>
               {SkelArr.map(()=> <Col xs={24} md={8}>
                  <Skeleton.Button active block style={{height:110}} />
                </Col>)}
              </Row>: <Row gutter={[20, 20]}>
                <Col md={8} xs={24}>
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

                <Col md={8} xs={24}>
                  <Card>
                    <Statistic
                      title="Average Score"
                      value={Math.ceil(result.averageScore)}
                      // prefix={<UserOutlined />} 
                    />
                  </Card>
                </Col>

                <Col md={8} xs={24}>
                  <Card>
                    <Statistic
                      title="Absent Students"
                      value={result.absentStudents}
                      // prefix={<CloseOutlined />}
                    />
                  </Card>
                </Col>

                <Col md={8} xs={24}>
                  <Card>
                    <Statistic
                      title="Finished Students"
                      value={result.completedTest}
                      // prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>

               {test.passingScore?<> <Col md={8} xs={24}>
                  <Card>
                    <Statistic
                      title="Passed Students"
                      value={result.totalPassing}
                      // prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>

               {test.passingScore? <Col md={8} xs={24}>
                  <Card>
                    <Statistic
                      title="Failed Students"
                      value={result.totalFailed}
                      // prefix={<UserOutlined />}
                    />
                  </Card>
                  </Col>:null}
                </> : null}
              </Row>}
             
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
            <Tabs tabBarExtraContent={{
              right: <Button loading={printingResult} onClick={() => {
                confirm({
                  title: `Are you sure, you want to print the results`,
                  // icon: <ExclamationCircleOutlined />,
                  // content: `Money will be deducted from your wallet`,
                  onOk() {
                    printResults(undefined, {
                      onSuccess: (s) => printPdf(s)
                    })                  },
                  okText: 'Yes, Print'
                })
            
              }}
              type='primary'>
              Print Result
            </Button>}}
              defaultActiveKey="1" navigateWithHash
              items={[
                {
                  key: 'Attended',
                  label: 'Attended',
                  children: <TestAttendedList />
                },
                {
                  key: 'Enrolled',
                  label: 'Enrolled',
                  children: <TestEnrolledList />
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
