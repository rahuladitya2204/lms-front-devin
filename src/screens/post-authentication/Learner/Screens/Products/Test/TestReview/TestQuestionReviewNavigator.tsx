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
import { Enum, Learner } from '@adewaskar/lms-common'

import { NavLink } from 'react-router-dom'
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

  return (
    <Spin spinning={isLoading || loadingTest}>
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
                                          : item.isAnswered &&
                                            item.type !== 'subjective'
                                            ? 'primary'
                                            : 'default'
                                    }
                                    style={{
                                      backgroundColor: isActive
                                        ? 'auto'
                                        : item.isAnswered &&
                                          item.type !== 'subjective'
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
