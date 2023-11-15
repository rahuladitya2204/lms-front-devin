import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  HighlightTwoTone,
  InfoCircleOutlined,
  WarningOutlined,
  WarningTwoTone
} from '@ant-design/icons'
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  theme
} from 'antd'

import { Fragment } from 'react'
import { Learner } from '@adewaskar/lms-common'
import { NavLink } from 'react-router-dom'
import { OverallPerformancePie } from '../../TestResult/TestMetrics'
import TestTimer from '../TestQuestionNavigator/TestTimer'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useNavigate } from 'react-router'
import { useReviewQuestion } from './TestPlayerItemReview'

interface TestReviewQuestionNavigatorPropsI {
  testId: string;
  questionId: string;
}
const { confirm } = Modal
const { Text, Title } = Typography

export default function TestReviewQuestionNavigator(
  props: TestReviewQuestionNavigatorPropsI
) {
  const navigate = useNavigate()
  const {
    isLoading,
    data: { test: { sections }, charts }
  } = Learner.Queries.useGetTestResult(props.testId + '')
  const { currentQuestion, loading } = useReviewQuestion()
  // const { isTablet, isDesktop, isMobile } = useBreakpoint()
  const {
    data: test,
    isLoading: loadingTest
  } = Learner.Queries.useGetTestDetails(props.testId + '')

  // const VIEWING_MODE = (hasEnded && !test.isLive) ? 'review' : 'test';
  const { token } = theme.useToken()
  const {
    mutate: endTest,
    isLoading: submittingTest
  } = Learner.Queries.useEndTest()
  const SubmitTestButton = (
    <Button
      block
      onClick={() => {
        confirm({
          title: 'Are you sure?',
          // icon: <ExclamationCircleOutlined />,
          content: `You want to submit this test?`,
          onOk() {
            endTest(
              { testId: test._id + '' },
              {
                onSuccess: () => {
                  if (!test.isLive) {
                    return navigate('../result')
                  }
                  navigate('../completed')
                }
              }
            )
          },
          okText: 'Yes, Submit'
        })
      }}
      type="primary"
      danger
      loading={submittingTest}
    >
      Submit Test
    </Button>
  )
  return (
    <Spin spinning={isLoading}>
      <Card
        style={{ height: '80vh' }}
        bodyStyle={{ overflow: 'scroll', height: '100%' }}
      >
        <Row>
          {/* <Col span={24}>
            <OverallPerformancePie data={charts} />
          </Col> */}
          <Col span={24}>
            <Row gutter={[20, 20]}>
              <Col span={12}>
                <Space>
                  <Button
                    shape="circle"
                    style={{ backgroundColor: token.colorSuccessActive }}
                    type="primary"
                  />{' '}
                  Corrrect Answer
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Button shape="circle" type="primary" danger /> Incorrect
                  Answer
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Button shape="circle" /> Not Attempted
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Button
                    style={{ backgroundColor: token.colorPrimary }}
                    shape="circle"
                  />{' '}
                  Current Question
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Title style={{ textAlign: 'center' }} level={3}>
              Question Panel
            </Title>

            {sections.map(section => {
              return (
                <Row>
                  <Col span={24}>
                    <Title level={4}>{section.title}</Title>
                    <Row gutter={[20, 20]}>
                      {section.items.map((item, itemIndex) => {
                        return (
                          <Col span={3}>
                            <NavLink
                              style={{ width: '100%' }}
                              key={item._id}
                              to={`${item._id}`}
                              children={({ isActive }) => {
                                const isCurrent =
                                  currentQuestion._id === item._id
                                return (
                                  // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                                  // <Badge count={item.isMarked? <HighlightTwoTone /> :null} showZero>
                                  <Button
                                    // loading={loading && isCurrent}
                                    onClick={() => navigate(item._id + '')}
                                    danger={item.isMarked}
                                    type={
                                      isActive
                                        ? 'primary'
                                        : item.isMarked
                                          ? 'primary'
                                          : item.isAnswered
                                            ? 'primary'
                                            : 'default'
                                    }
                                    style={{
                                      backgroundColor: isActive
                                        ? 'auto'
                                        : item.isAnswered
                                          ? item.isCorrect
                                            ? token.colorSuccessActive
                                            : token.colorError
                                          : 'default'
                                    }}
                                    shape="circle"
                                    // icon={
                                    //   item.isAnswered ? (
                                    //     <Fragment>
                                    //       {item.isCorrect ? (
                                    //         <CheckOutlined />
                                    //       ) : (
                                    //         <CloseOutlined />
                                    //       )}
                                    //     </Fragment>
                                    //   ) : null
                                    // }
                                  >
                                    {itemIndex + 1}
                                  </Button>
                                  //  </Badge>
                                )
                              }}
                            />
                          </Col>
                        )
                      })}
                    </Row>
                  </Col>
                </Row>
              )
            })}
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}
