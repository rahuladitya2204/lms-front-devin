import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  List,
  Progress,
  Row,
  Spin,
  Tag,
  Typography
} from 'antd'
import { CheckCircleTwoTone, InfoCircleOutlined } from '@ant-design/icons'

import Countdown from '@Components/Countdown'
import { Fragment } from 'react'
import { Learner } from '@adewaskar/lms-common'
import { NavLink } from 'react-router-dom'
import dayjs from 'dayjs'
import styled from 'styled-components'
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
  const { data: test } = Learner.Queries.useGetTestDetails(props.testId + '')
  //    const { data: { sections } } = Learner.Queries.useGetTestStatus(
  const { data: { sections }, isFetching } = Learner.Queries.useGetTestStatus(
    props.testId + ''
  )
  const {
    data: enrolledProduct
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: test._id + ''
  })
  const endingAt = dayjs(enrolledProduct.metadata.test.startedAt)
    .add(test.duration, 'minutes')
    .toString()
  return (
    <Card style={{ height: '80vh', overflow: 'scroll' }}>
      <Row>
        <Col span={24}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 0
            }}
            title="Time Spent"
          >
            <Progress
              size={200}
              format={() => {
                return (
                  <Row>
                    <Col span={24}>
                      <Title type="secondary" style={{ fontSize: 18 }}>
                        Remaining Time
                      </Title>
                      <Title style={{ marginTop: 0, fontSize: 25 }}>
                        <Countdown targetDate={endingAt} />
                      </Title>
                    </Col>
                  </Row>
                )
              }}
              type="circle"
              percent={75}
            />
          </div>
        </Col>
        <Divider style={{ margin: 0, marginTop: 10 }} />
        <Col span={24}>
          <Title style={{ textAlign: 'center' }} level={3}>
            Question Panel
          </Title>
          {sections.map(section => {
            return (
              <Row>
                <Col span={24}>
                  <Title level={4}>{section.title}</Title>
                  <Row>
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
                                    : (item.isAnswered ? 'green' : 'default')
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
