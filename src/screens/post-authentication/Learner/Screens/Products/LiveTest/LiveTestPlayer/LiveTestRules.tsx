import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  List,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'
import { TERMS, TEST_RULES } from './constant'
import { useNavigate, useParams } from 'react-router'

import Countdown from '@Components/Countdown'
import { Fragment } from 'react'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const { Title, Text } = Typography

interface LiveTestRulesPropsI {}

export default function LiveTestRules(props: LiveTestRulesPropsI) {
  const { testId } = useParams()
  const { mutate: startTest } = Learner.Queries.useStartLiveTest()
  const { data: liveTest } = Learner.Queries.useGetLiveTestDetails(testId + '')
  const [form] = Form.useForm()
  const rule1 = Form.useWatch('rule-1', form)
  const rule2 = Form.useWatch('rule-2', form)
  const rule3 = Form.useWatch('rule-3', form)
  const isValid = rule1 && rule2 && rule3
  const endingAt = dayjs(liveTest.scheduledAt)
    .add(liveTest.duration, 'minutes')
    .toString()
  const navigate = useNavigate()
  return (
    <Header
      title={liveTest.title}
      extra={[
        <Tag color="blue">
          Time Left: <Countdown targetDate={endingAt} />
        </Tag>,
        <Tag color="cyan">Time Limit: {liveTest.duration} mins</Tag>
      ]}
    >
      <Row>
        <Col span={4} />
        <Col span={16}>
          <Row>
            <Col span={24}>
              <Title style={{ textAlign: 'center' }}>Coding Assesment</Title>
              <List
                itemLayout="horizontal"
                dataSource={TEST_RULES}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta title={item.rule} />
                  </List.Item>
                )}
              />
            </Col>
            <Divider />
            <Col span={24}>
              <Title level={4}>Term & Pledges</Title>
              <Form form={form}>
                {TERMS.map(({ term, termId }) => {
                  return (
                    <Form.Item name={termId} valuePropName="checked">
                      <Checkbox>{term}</Checkbox>
                    </Form.Item>
                  )
                })}
              </Form>
              <Row
                align={'middle'}
                style={{ display: 'flex', flexDirection: 'row-reverse' }}
              >
                <Col flex={'reverse'}>
                  <Button>Back</Button>
                  <Button
                    onClick={() => {
                      startTest(
                        {
                          testId: liveTest._id + ''
                        },
                        {
                          onSuccess: () => {
                            navigate('../player')
                          }
                        }
                      )
                    }}
                    disabled={!isValid}
                    style={{ marginLeft: 10 }}
                    type="primary"
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={4} />
      </Row>
    </Header>
  )
}
