import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Row,
  Skeleton,
  Space,
  Spin,
  theme
} from 'antd'
import { Enum, Learner } from '@adewaskar/lms-common'
import { useNavigate, useParams } from 'react-router'

import { NavLink } from 'react-router-dom'
import { TestNavigatorSkeleton } from './TestItemSkeleton'
import { Typography } from '@Components/Typography'
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
    isLoading: loadingResult,
    data: { test: { sections } }
  } = Learner.Queries.useGetTestResult(props.testId + '')
  const { currentQuestion, loading } = useReviewQuestion()
  // const { isTablet, isDesktop, isMobile } = useBreakpoint()
  const {
    data: test,
    isLoading: loadingTest
  } = Learner.Queries.useGetTestDetails(
    props.testId + '',
    Enum.TestDetailMode.RESULT
  )

  const { token } = theme.useToken()
  const { questionId } = useParams()
  const isLoading = loadingResult || loadingTest
  return (
    <Card
      style={{ height: '80vh' }}
      bodyStyle={{ overflow: 'scroll', height: '100%' }}
    >
      <Row>
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
                <Button shape="circle" type="primary" danger /> Incorrect Answer
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
          {isLoading ? (
            <TestNavigatorSkeleton />
          ) : (
            sections.map((section: any) => {
              return (
                <Row>
                  <Col span={24}>
                    <Title level={4}>{section.title}</Title>
                    <Row gutter={[20, 20]}>
                      {section.items.map((item: any, itemIndex: number) => {
                        return (
                          <Col span={3}>
                            <NavLink
                              style={{ width: '100%' }}
                              key={item._id}
                              to={`${item._id}`}
                              children={() => {
                                const isActive = questionId === item._id
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
                                        ? ''
                                        : item.isAnswered
                                          ? item.type !== 'subjective'
                                            ? item.isCorrect
                                              ? token.colorSuccessActive
                                              : token.colorError
                                            : token.colorWarningActive
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
            })
          )}
        </Col>
      </Row>
    </Card>
  )
}
