import { Button, Card, Col, Divider, Row, Typography } from 'antd'

import { Learner } from '@adewaskar/lms-common'
import { NavLink } from 'react-router-dom'
import TestTimer from './TestTimer'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useNavigate } from 'react-router'

interface TestQuestionNavigatorType2PropsI {
  testId: string;
  questionId: string;
}

const { Text, Title } = Typography

export default function TestQuestionNavigatorType2(
  props: TestQuestionNavigatorType2PropsI
) {
  const navigate = useNavigate()
  const { data: { sections }, isFetching } = Learner.Queries.useGetTestStatus(
    props.testId + ''
  )

  const { isTablet, isDesktop, isMobile } = useBreakpoint()
  const { data: test,isLoading: loadingTest } = Learner.Queries.useGetTestDetails(props.testId + '')

  return (
    <Card
      style={{ height: '80vh' }}
      bodyStyle={{ overflow: 'scroll', height: '100%' }}
    >
      <Row>
        {isDesktop ? (
          <>
          {test.duration.enabled?<Col span={24}>
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
                            children={({ isActive }) => (
                              <Button
                                onClick={() => navigate(item._id)}
                                type={
                                  isActive
                                    ? 'primary'
                                    : item.isAnswered ? 'primary' : 'default'
                                }
                                style={{
                                  backgroundColor: isActive
                                    ? 'auto'
                                    : item.isAnswered ? 'green' : 'default'
                                }}
                                shape="circle"
                              >
                                {itemIndex + 1}
                              </Button>
                            )}
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
