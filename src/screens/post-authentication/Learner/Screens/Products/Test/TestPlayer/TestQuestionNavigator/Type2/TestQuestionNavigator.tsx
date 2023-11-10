import { ArrowDownOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Badge, Button, Card, Col, Divider, Row, Typography, theme } from 'antd'

import { Learner } from '@adewaskar/lms-common'
import { NavLink } from 'react-router-dom'
import TestTimer from './TestTimer'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useNavigate } from 'react-router'
import useQuestion from '../../hooks/useQuestion'

interface TestQuestionNavigatorType2PropsI {
  testId: string;
  questionId: string;
}

const { Text, Title } = Typography

export default function TestQuestionNavigatorType2(
  props: TestQuestionNavigatorType2PropsI
) {
  const navigate = useNavigate()
  const { data: { sections,hasEnded,hasStarted }, isFetching } = Learner.Queries.useGetTestStatus(
    props.testId + ''
  )
  const { currentQuestion,loading}=useQuestion();
  const { isTablet, isDesktop, isMobile } = useBreakpoint()
  const { data: test,isLoading: loadingTest } = Learner.Queries.useGetTestDetails(props.testId + '')

  const VIEWING_MODE = (hasEnded && !test.isLive) ? 'review' : 'test';
  const { token } = theme.useToken()

  return (
    <Card
      style={{ height: '80vh' }}
      bodyStyle={{ overflow: 'scroll', height: '100%' }}
    >
      <Row>
        {isDesktop ? (
          <>
          {(test.duration.enabled&&hasStarted&&!hasEnded)?<Col span={24}>
            {/* <Button type='primary' style={{marginBottom:30}} danger block size='large'> Submit Test</Button> */}
            <TestTimer testId={props.testId} />
            <Divider style={{ margin: 0, marginTop: 10 }} />
 </Col>:null}
          </>
        ) : (
          <Button
            type="primary"
            style={{ marginBottom: 30 }}
            danger
            block
            size="large"
          >
            {' '}
            Submit Test
          </Button>
        )}
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
                              const isCurrent = currentQuestion._id === item._id;
                              return (
                              // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                                <Button
                                  // loading={loading && isCurrent}
                                onClick={() => navigate(item._id)}
                                type={
                                  isActive
                                    ? 'primary'
                                    : (item.isAnswered ? 'primary' : 'default')
                                }
                                style={{
                                  backgroundColor: isActive
                                    ? 'auto'
                                    : (item.isAnswered ? token.colorSuccessActive : 'default')
                                }}
                                shape="circle"
                              >
                                {itemIndex + 1}
                                </Button>
                                // </Badge>
                            )}}
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
  )
}
