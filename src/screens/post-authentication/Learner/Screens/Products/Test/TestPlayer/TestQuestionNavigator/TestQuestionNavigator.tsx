import { ArrowDownOutlined, ArrowLeftOutlined, HighlightTwoTone, InfoCircleOutlined, WarningOutlined, WarningTwoTone } from '@ant-design/icons'
import { Badge, Button, Card, Col, Divider, Modal, Row, Skeleton, Space, Spin, theme } from 'antd'
import { Enum, Learner, Store } from '@adewaskar/lms-common'
import { useNavigate, useParams } from 'react-router'

import { NavLink } from 'react-router-dom'
import { TestNavigatorSkeleton } from '../../TestReview/TestItemSkeleton'
import TestTimer from './TestTimer'
import { Typography } from '@Components/Typography'
import useBreakpoint from '@Hooks/useBreakpoint'

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
  const { data: { status: {
    sections,hasStarted,hasEnded
  } } } = Learner.Queries.useGetTestStatus(props.testId + '')

  const { isLoading: loadingEnrolledTest } = Learner.Queries.useGetEnrolledProductDetails({
    type: "test",
    id: props.testId
  })
  const { isTablet, isDesktop, isMobile } = useBreakpoint()
  const { data: test,isLoading: loadingTest } = Learner.Queries.useGetTestDetails(props.testId + '',Enum.TestDetailMode.TEST)
  const { token } = theme.useToken()
  const { questionId } = useParams()
  const isLoading = loadingTest || loadingEnrolledTest;
  return (
      <Card
      style={{ height: '80vh' }}
      bodyStyle={{ overflow: 'scroll', height: '100%' }}
    >
      <Row>
        {isDesktop ? (
          <>
          {(test.duration.enabled)?<Col span={24}>
            {/* <Button type='primary' style={{marginBottom:30}} danger block size='large'> Submit Test</Button> */}
          <Row justify={'center'} align={'middle'}><Col>            {isLoading?<Skeleton.Button active shape='circle' style={{width:200,height:200}} />:((hasStarted&&!hasEnded)?<TestTimer testId={props.testId} />:null)}
</Col></Row>
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
          {isLoading?<TestNavigatorSkeleton/>:sections.map(section => {
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
                            children={() => {
                              const isActive = questionId === item._id
                              return (
                              // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                              // <Badge count={item.isMarked? <HighlightTwoTone /> :null} showZero>
                              <Button
                                  // loading={loading && isCurrent}
                                onClick={() => navigate(item._id)} danger={item.isMarked&&!isActive}
                                type={
                                  isActive
                                    ? 'primary'
                                    : (item.isMarked?'primary':(item.isAnswered ? 'primary' : 'default'))
                                }
                                style={{
                                  backgroundColor: isActive
                                    ? ''
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
  )
}
