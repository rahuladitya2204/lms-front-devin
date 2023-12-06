import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  List,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  notification
} from 'antd'
import { Constants, Learner } from '@adewaskar/lms-common'
import { TERMS, TEST_RULES } from './constant'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal'
import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import IDVerificationComponent from '@Learner/Screens/Procturing/hooks/IDVerification/IDVerificationComponent'
import TestTimeCountdown from '@Components/TestTimeCountdown'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'

const { Title, Text } = Typography

interface TestRulesPropsI {}

export default function TestRules(props: TestRulesPropsI) {
  const { testId } = useParams()
  const {
    mutate: startTest,
    isLoading: startingTest
  } = Learner.Queries.useStartTest(testId + '')
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '')
  const {
    data: { status: { hasEnded, hasStarted } }
  } = Learner.Queries.useGetTestStatus(testId + '')
  const {
    data: enrolledProduct,
    isLoading: loadingEnrolledTest
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const isVerificationOn = test.rules.identityVerification.enabled
  const [form] = Form.useForm()
  const rule1 = Form.useWatch('rule-1', form)
  const rule2 = Form.useWatch('rule-2', form)
  const rule3 = Form.useWatch('rule-3', form)
  const isValid = rule1 && rule2 && rule3
  const testStartDate =
    enrolledProduct.metadata.test.startedAt || test.live.startedAt
  const testEndDate = enrolledProduct.metadata.test.endedAt || test.live.endedAt
  const endingAt = test.duration.enabled
    ? dayjs(enrolledProduct.metadata.test.startedAt)
        .add(test.duration.value, 'minutes')
        .toString()
    : null
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()

  const onSubmit = (data: { language: string }) => {
    startTest(
      {
        testId: test._id + '',
        language: data.language
      },
      {
        onSuccess: () => {
          console.log('Helo')
          navigate('../player')
        }
      }
    )
  }

  return (
    <Spin spinning={loadingEnrolledTest}>
      <Header
        showBack
        title={test.title}
        extra={
          !isMobile
            ? [
                hasStarted ? (
                  testStartDate && endingAt ? (
                    <Tag color="blue">
                      Time Left: <TestTimeCountdown testId={testId + ''} />
                    </Tag>
                  ) : null
                ) : test.duration.enabled ? (
                  <Tag color="cyan">Time Limit: {test.duration.value} mins</Tag>
                ) : null
              ]
            : null
        }
      >
        <Row gutter={[20, 20]}>
          <Col xs={1} md={4} />
          <Col xs={22} md={16}>
            <Row>
              <Col span={24}>
                <Title style={{ textAlign: 'center' }}>Online Assesment</Title>
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
                <Form onFinish={onSubmit} layout="vertical" form={form}>
                  {TERMS.map(({ term, termId }) => {
                    return (
                      <Form.Item name={termId} valuePropName="checked">
                        <Checkbox>{term}</Checkbox>
                      </Form.Item>
                    )
                  })}

                  <Form.Item
                    rules={[{ required: true }]}
                    label="Select Preferred Language"
                    name="language"
                  >
                    <Select
                      placeholder="Select Preferred Language"
                      options={Constants.LANGUAGES.filter(lang =>
                        // @ts-ignore
                        test.languages.includes(lang.value)
                      ).map(l => {
                        return {
                          label: l.label,
                          value: l.value
                        }
                      })}
                    />
                  </Form.Item>
                  <Row
                    align={'middle'}
                    style={{ display: 'flex', flexDirection: 'row-reverse' }}
                  >
                    <Col flex={isMobile ? 1 : 'reverse'}>
                      {!isVerificationOn ? (
                        <Button
                          disabled={!isValid}
                          style={{
                            width: !isMobile ? 150 : '100%',
                            display: 'inline-block'
                          }}
                          type="primary"
                          loading={startingTest}
                          onClick={form.submit}
                        >
                          {testStartDate && !testEndDate
                            ? 'Continue Test'
                            : 'Start Test'}
                        </Button>
                      ) : (
                        <ActionModal
                          cta={
                            <Button
                              disabled={!isValid}
                              style={{ marginLeft: 20, width: 200 }}
                              type="primary"
                            >
                              Verify and Start Test
                            </Button>
                          }
                        >
                          <IDVerificationComponent
                            onMatch={() => {
                              notification.success({
                                message: 'Success',
                                description: 'ID Verified!'
                              })
                              form.submit()
                            }}
                          />
                        </ActionModal>
                      )}
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col xs={1} md={4} />
        </Row>
      </Header>
    </Spin>
  )
}
