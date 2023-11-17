import { ArrowDownOutlined, ArrowLeftOutlined, HighlightTwoTone, InfoCircleOutlined, WarningOutlined, WarningTwoTone } from '@ant-design/icons'
import { Badge, Button, Card, Col, Divider, Modal, Row, Space, Spin, Typography, theme } from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import { NavLink } from 'react-router-dom'
import TestTimer from './TestTimer'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useNavigate } from 'react-router'
import useQuestion from '../hooks/useQuestion'

interface TestQuestionNavigatorType2PropsI {
  testId: string;
  questionId: string;
}
const { confirm } = Modal;
const { Text, Title } = Typography

export default function TestQuestionNavigatorType2(
  props: TestQuestionNavigatorType2PropsI
) {
  const navigate = useNavigate()
  const { sections, hasEnded, hasStarted } = Store.useTestStore(s => s.testStatus);
  const { currentQuestion } = useQuestion();
  const {isLoading: loadingEnrolledTest } = Learner.Queries.useGetEnrolledProductDetails({
    type: "test",
    id: props.testId
  })
  const { isTablet, isDesktop, isMobile } = useBreakpoint()
  const { data: test,isLoading: loadingTest } = Learner.Queries.useGetTestDetails(props.testId + '')
  const { token } = theme.useToken()

  return (
    <Spin spinning={loadingTest || loadingEnrolledTest} >
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
          null
        )}
          <Col span={24} style={{marginTop:25}}>
            <Row gutter={[20, 20]}>
              <Col span={12}>
                <Space>
                  <Button
                    shape="circle"
                    style={{ backgroundColor: token.colorSuccessActive }}
                    type="primary"
                  />{' '}
                  Attempted
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Button shape="circle" type="primary" danger /> Marked for Review
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
                              const isCurrent = currentQuestion._id === item._id;
                              return (
                              // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                              // <Badge count={item.isMarked? <HighlightTwoTone /> :null} showZero>
                              <Button
                                  // loading={loading && isCurrent}
                                onClick={() => navigate(item._id)} danger={item.isMarked}
                                type={
                                  isActive
                                    ? 'primary'
                                    : (item.isMarked?'primary':(item.isAnswered ? 'primary' : 'default'))
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
                                //  </Badge>
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
    </Spin>
  )
}
