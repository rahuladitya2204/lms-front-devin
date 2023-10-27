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
  Typography,
  notification
} from 'antd'
import { TERMS, TEST_RULES } from './constant'
import { useNavigate, useParams } from 'react-router'

import Countdown from '@Components/Countdown'
import { Fragment } from 'react'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import IDVerificationComponent from '@Learner/Screens/Procturing/hooks/IDVerification/IDVerificationComponent'
import ActionModal from '@Components/ActionModal'

const { Title, Text } = Typography

interface TestRulesPropsI {}

export default function TestRules(props: TestRulesPropsI) {
  const { testId } = useParams()
  const { mutate: startTest } = Learner.Queries.useStartTest()
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '')
  const {
    data: enrolledProduct
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const [form] = Form.useForm()
  const rule1 = Form.useWatch('rule-1', form)
  const rule2 = Form.useWatch('rule-2', form)
  const rule3 = Form.useWatch('rule-3', form)
  const isValid = rule1 && rule2 && rule3
  const endingAt = dayjs(enrolledProduct.metadata.test.startedAt)
    .add(test.duration, 'minutes')
    .toString()
  const navigate = useNavigate()
  return (
    <Header
      title={test.title}
      extra={[
        <Tag color="blue">
          Time Left: <Countdown targetDate={endingAt} />
        </Tag>,
        <Tag color="cyan">Time Limit: {test.duration} mins</Tag>
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
                  {/* <Button
                    onClick={() => {
                      startTest(
                        {
                          testId: test._id + ''
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
                  </Button> */}
                  <ActionModal cta={<Button>Verify</Button>}>
                    <IDVerificationComponent
                      onMatch={() => {
                        notification.success({
                          message: 'Success',
                          description: 'ID Verified!'
                        })

                        startTest(
                          {
                            testId: test._id + ''
                          },
                          {
                            onSuccess: () => {
                              navigate('../player')
                            }
                          }
                        )
                      }}
                    />
                  </ActionModal>
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
