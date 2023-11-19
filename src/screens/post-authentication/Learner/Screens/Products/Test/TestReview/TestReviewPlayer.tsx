import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Modal,
  Progress,
  Row,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography
} from 'antd'
import { ArrowLeftOutlined, MenuOutlined } from '@ant-design/icons'
import { Learner, Store } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo } from 'react'

import Header from '@Components/Header'
import { NavLink } from 'react-router-dom'
import ProctoringComponent from '@Learner/Screens/Procturing/TestProcturing'
import TestPlayerMoreInfo from './TestPlayerMoreInfo'
import TestReviewQuestionNavigator from './TestQuestionReviewNavigator'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'

// const ProctoringComponent = lazy(() => import('@Learner/Screens/Procturing/TestProcturing'));

const { confirm } = Modal

interface TestPlayerPropsI {
  isReview?: boolean;
}

const { Title,Text } = Typography

export default function TestReviewPlayer(props: TestPlayerPropsI) {
  const { testId,questionId } = useParams()
  const navigate = useNavigate()
  const {
    mutate: endTest,
    isLoading: submittingTest
  } = Learner.Queries.useEndTest()
  const {
    data: enrolledProduct,isLoading: loadingEnrolledProduct
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '')
  const isProcturingOn = test.rules.procturing.enabled
  
  useEffect(
    () => {
      if (test.sections[0]?.items[0] && !questionId) {
        const itemId = test.sections[0].items[0]._id
        navigate(`${itemId}`)
      }
    },
    [test.sections]
  );
  
  const endTestNow =
    enrolledProduct.metadata.test.endedAt ||
    enrolledProduct.metadata.test.submittedAt

  if (endTestNow) {
    // navigate('../completed')
  };
  const testEndTime = enrolledProduct.metadata.test.endedAt || test.live.endedAt;

  const { isTablet, isDesktop, isMobile } = useBreakpoint();
 
const ExitButton = <Button style={{width:100}}
onClick={() => {
  confirm({
    title: 'Are you sure?',
    // icon: <ExclamationCircleOutlined />,
    content: `You want to exit reviewing?`,
    onOk() {
      navigate('../')
    },
    okText: 'Yes, Exit'
  })
}}
type="primary" danger
loading={submittingTest}
>
Exit
</Button>;
  const QuestionNavigator = TestReviewQuestionNavigator
  return (
    <Spin  spinning={loadingEnrolledProduct}>
        <Header
        title={<Space> <NavLink to={`../app/test/${testId}/result`} ><Button type='primary' icon={<ArrowLeftOutlined/>} ></Button></NavLink> {test.title }</Space>}
      subTitle={'asd'}
        extra={[<Tag style={{marginRight:30}}>Submitted at { dayjs(testEndTime).format('LLL')}</Tag>,ExitButton]}
    >
      {isProcturingOn ? <><ProctoringComponent />   <Alert
        style={{ marginBottom: 50 }}
        message="Please Note: This exam is being proctured. Any suspicious activity will be reported and submit the test immediately."
        type="info"
        showIcon
      /></>: null}
    
      <Row>
        <Col span={1} />
        <Col span={22}>
          <Row gutter={[50, 30]}>
          <Col md={24} lg={16}>
                <Outlet />
              <Card style={{marginTop:20}}>
                <TestPlayerMoreInfo itemId={questionId+''} test={test} />
              </Card>
            </Col>
            {isDesktop?<Col lg={8} md={0}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <QuestionNavigator questionId={questionId+''} testId={testId + ''} />
                </Col>
              </Row>
            </Col>:null}
         
          </Row>
        </Col>
        <Col span={1} />
      </Row>
    </Header></Spin>

  )
}
