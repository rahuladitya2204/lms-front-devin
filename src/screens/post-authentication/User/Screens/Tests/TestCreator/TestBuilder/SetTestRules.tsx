import {
  Button,
  Col,
  Divider,
  Form,
  Row,
  Space,
  Switch,
} from 'antd'
import { Types, User } from '@invinciblezealorg/lms-common'

import { Typography } from '@Components/Typography'
import styled from 'styled-components'
import { useEffect } from 'react'
import { useParams } from 'react-router'

interface SetTestRulesPropsI {
  closeModal?: () => void;
  testId: string;
}

const SwitchButton = styled(Switch)`
  .ant-form-item-control-input-content {
    button {
      float: right !important;
    }
  }
`

export default function SetTestRules(props: SetTestRulesPropsI) {
  const [form] = Form.useForm()
  const testId = props.testId
  const { data: test, isFetching: loadingTest } = User.Queries.useGetTestDetails(
    testId + '',
    {
      enabled: !!testId
    }
  )
  const {
    mutate: updateTest,
    isLoading: savingRules
  } = User.Queries.useUpdateTest()

  const saveTest = (d: Partial<Types.Test>) => {
    const Data = { ...test, ...d }
    if (test._id) {
      updateTest(
        {
          id: testId + '',
          data: Data
        },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    }
  }

  useEffect(
    () => {
      form.setFieldsValue(test.rules)
    },
    [test]
  )

  const onSubmit = (d: Types.TestRules) => {
    saveTest({
      rules: d
    })
  }

  const isLive = test.live.enabled

  return (
    <Form form={form} onFinish={onSubmit}>
      <Row justify={'space-between'} align="middle">
        <Col>Enable Procturing</Col>
        <Col>
          <Form.Item
            valuePropName="checked"
            name={['procturing', 'enabled']}
            // label=""
          >
            <SwitchButton style={{ marginTop: 20 }} />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Text>Exam will be AI monitored</Typography.Text>
      <Divider />
      <Row justify={'space-between'} align="middle">
        <Col>ID Verification</Col>
        <Col>
          <Form.Item
            valuePropName="checked"
            name={['identityVerification', 'enabled']}
            help
          >
            <SwitchButton style={{ marginTop: 20 }} />
          </Form.Item>
        </Col>
      </Row>

      <Divider>Test Results</Divider>
     {!isLive?<> <Row justify={'space-between'} align="middle">
        <Col>Show Result Immediately</Col>
        <Col>
          <Form.Item
            valuePropName="checked"
            name={['results', 'showImmediate']}
            help
          >
            <SwitchButton style={{ marginTop: 20 }} />
          </Form.Item>
        </Col>
      </Row></> :null}
      <Row justify={'space-between'} align="middle">
        <Col>Show Result Leaderboard</Col>
        <Col>
          <Form.Item
            valuePropName="checked"
            name={['results', 'showLeaderboard']}
            help
          >
            <SwitchButton style={{ marginTop: 20 }} />
          </Form.Item>
        </Col>
        </Row>  
      <Row justify={'space-between'} align="middle">
        <Col>Show Correct Answer Rate(Percent)</Col>
        <Col>
          <Form.Item
            valuePropName="checked"
            name={['results', 'showCorrectAnswerPercent']}
            help
          >
            <SwitchButton style={{ marginTop: 20 }} />
          </Form.Item>
        </Col>
      </Row>

      {/* <Typography.Text>Verify ID of the student giving exam.</Typography.Text> */}
      <Divider />
      {/* <Row justify={'space-between'} align="middle">
        <Col>Enforce complete video viewing</Col>
        <Col>
          <Form.Item
            valuePropName="checked"
            name={['sequentialPath', 'completeItem']}
          >
            <SwitchButton style={{ marginTop: 20 }} />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Text>
        Learners need to watch at-least 90% of the video lesson to move to next
        course item. It only works if sequential learning path is enabled. This
        feature is compatible only with videos uploaded on the platform.
      </Typography.Text> */}

      <Space
        style={{
          paddingTop: 20,
          display: 'flex',
          flexDirection: 'row-reverse'
        }}
      >
        {' '}
        <Button loading={savingRules} type="primary" onClick={form.submit}>
          Submit
        </Button>
      </Space>
    </Form>
  )
}
