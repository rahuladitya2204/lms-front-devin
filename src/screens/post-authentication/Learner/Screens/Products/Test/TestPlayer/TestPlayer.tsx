import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Timeline,
  message,
} from 'antd'
import { BookOutlined, MenuOutlined } from '@ant-design/icons'
import { Enum, Learner } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import React, { useEffect } from 'react'

import ActionDrawer from '@Components/ActionDrawer'
import ActionModal from '@Components/ActionModal/ActionModal'
import AnswerSheetFiles from './TestPlayerItem/OMR/AnswerSheetFiles'
import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import { NavLink } from 'react-router-dom'
import ProctoringComponent from '@Learner/Screens/Procturing/TestProcturing'
import TestItemSkeleton from '../TestReview/TestItemSkeleton'
import TestQuestionNavigator from './TestQuestionNavigator/TestQuestionNavigator'
import TestTimeCountdown from '@Components/TestTimeCountdown'
import { Typography } from '@Components/Typography'
import dayjs from 'dayjs'
import { openWindow } from '@Components/Editor/SunEditor/utils'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useQueryClient } from '@tanstack/react-query'

// const AnswerSheetFiles = React.lazy(() => import('./TestPlayerItem/OMR/AnswerSheetFiles')); // Lazy-loaded content

const OMRComponent = React.lazy(() => import('./TestPlayerItem/OMR/OMRComponent')); // Lazy-loaded content

const { confirm } = Modal

interface TestPlayerPropsI {
}

const { Title } = Typography

export default function TestPlayer(props: TestPlayerPropsI) {
  const { testId, questionId } = useParams();
  const navigate = useNavigate()
  const {
    mutate: endTest,
    isLoading: submittingTest
  } = Learner.Queries.useEndTest()
  const {
    data: enrolledProduct,
    isLoading: loadingDetails
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '',Enum.TestDetailMode.TEST)
  const isProcturingOn = test.rules.procturing.enabled
  const { data: {
    status:{startedAt, hasStarted, hasEnded,sections}
  },isLoading: loadingStatus } = Learner.Queries.useGetTestStatus(testId+'')
  
  useEffect(
    () => {
      if (test.sections[0]?.items[0] && !questionId) {
        const itemId = test.sections[0].items[0]._id
        navigate(`${itemId}`)
      }
    },
    [test.sections]
  );

  const testEndTime = enrolledProduct?.metadata?.test?.endedAt;
  const { openModal} = useModal();
  const { isTablet, isDesktop, isMobile } = useBreakpoint();
  const qc = useQueryClient();
  const AnswerSheetButton = <ActionModal minHeight={500} lazy width={800}
    cta={<Button block={isMobile} type='primary'>Answer Sheet</Button>}
    title={<Row style={{ marginTop: 25 }}
      justify={'space-between'} align={'middle'}>
      <Col>
        <Title level={4}>Answer Sheet </Title></Col><Col>
        <Button type='primary' onClick={() => {
             if (isMobile) {
              openWindow(`/app/test/${testId}/upload-answer-sheet`, (refetchTestStatus: boolean) => {
                // debugger;
                if (refetchTestStatus) {
                  message.open({
                    type: 'success',
                    content: `Answer Sheet Recorded successfully`
                  });
                  qc.invalidateQueries([`GET_TEST_STATUS`, testId]);
                }
              })
            }
            else {
              openModal(<AnswerSheetFiles testId={testId + ''} />);
            }
        }} >Upload Answer Sheet</Button>
      </Col>
    </Row>}
  >
    <OMRComponent testId={testId + ''} />
</ActionModal>
  // const AnswerSheetButton = <Button
  //   onClick={() => openModal(<OMRComponent testId={testId + ''} />, {
  //     width: 800,
  //     title: <Row style={{marginTop:25}} justify={'space-between'} align={'middle'}>
  //       <Col><Title level={4}>Answer Sheet </Title></Col><Col>
  //         <ActionModal cta={<Button onClick={() => {
  //           openModal(<AnswerSheetFiles testId={testId+''} />)
  //         }} type='primary' >Upload Answer Sheet</Button>}>
  //     <AnswerSheetFiles testId={testId+''} /></ActionModal></Col>
  //     </Row>
  //   })}
  //   icon={<BookOutlined />}
  // block={!isDesktop} style={{ marginRight: 10 }} type='primary'>Answer Sheet</Button>
  const SubmitTestButton = <Button block={!isDesktop}
    onClick={() => {
      // @ts-ignore
      const markCount = sections.map(a => a.items).flat().filter(i => i.isMarked).length;
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: markCount ?
        `You have marked ${markCount} question${markCount > 1 ? 's' : ''} for review. Are you sure you want to submit?` :
        `You want to submit this test?`,
      onOk() {
        endTest(
          { testId: test._id + '' },
          {
            onSuccess: () => {
              // if (!test.live.enabled) {
              //   return navigate('../result')
              // }
              navigate('../completed')

            }
          }
        )
      },
      okText: 'Yes, Submit'
    })
  }}
  type="primary" danger
  loading={submittingTest}
>
  Submit Test
</Button>
  const targetDate = dayjs(startedAt).add(test.duration.value, 'minutes').toString();
  const CountdownComponent =
  test.duration.enabled?<Tag color="blue">
  Time Left: <Countdown targetDate={targetDate} /> 
    </Tag>:null
    
  const QuestionNavigator = TestQuestionNavigator;
  if (testEndTime) {
    return <Header title={test.title} extra={<NavLink to={'../'} ><Button type='primary'>Go Back</Button></NavLink>} >
      <Card>  
          <Title style={{textAlign:'center'}} >Test has ended.</Title>
      </Card>
    </Header>
  }
  const isLoading = loadingDetails || loadingStatus;
  const SideDrawer = <ActionDrawer extra={() => [CountdownComponent]} footer={() => [
   
    // UpdatingTestStatus,
    SubmitTestButton]} cta={<Button icon={<MenuOutlined />}>
    </Button>}>
    <div style={{paddingLeft:10,paddingRight:10,marginBottom:15,marginTop: 15}} >{ AnswerSheetButton}</div>
    <QuestionNavigator questionId={questionId + ''} testId={testId + ''} />
  </ActionDrawer>;
  return (
      <Header
      title={!isMobile?test.title:CountdownComponent}
      subTitle={'asd'}
      extra={<Row>
        {!isDesktop ? <Col>
        </Col>:null}
        <Col>
          {!isDesktop ? SideDrawer : <>
            {isLoading ? <Row><Col style={{ marginRight: 15 }}>
              <Skeleton.Button active style={{ width: 135, height: 32 }} /></Col><Col>
                <Skeleton.Button active style={{ width: 98, height: 32 }} /></Col></Row> : <Row>
                <Col style={{ marginRight: 15 }}>
                {AnswerSheetButton}</Col> 
<Col>{SubmitTestButton}</Col>
            </Row>}
          </>}
      </Col>
      </Row>}
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
              <Col xs={24} sm={24}  md={24} lg={16}>
                {isLoading?<TestItemSkeleton/>:<Outlet />  }             
              {/* only show if the test has ended */}
              {/* {testEndTime?<Card style={{marginTop:20}}>
                <TestPlayerMoreInfo itemId={questionId+''} test={test} />
              </Card>:null} */}
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
    </Header>

  )
}
