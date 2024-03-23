import {
  Button,
  Col,
  Divider,
  Form,
  Row,
  Space,
  Switch,
} from 'antd'

import { Types } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography';
import styled from 'styled-components'
import { useEffect } from 'react'

interface SetCourseRulesPropsI {
  closeModal?: () => void;
  data: Types.CourseRules;
  onSubmit: (d: Types.CourseRules) => void;
}

const SwitchButton = styled(Switch)`
  .ant-form-item-control-input-content {
    button {
      float: right !important;
    }
  }
`

export default function SetCourseRules(props: SetCourseRulesPropsI) {
  const [form] = Form.useForm()
  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  const onSubmit = (d: Types.CourseRules) => {
    props.onSubmit(d)
    props.closeModal && props.closeModal()
  }

  return (
    <Form form={form} onFinish={onSubmit}>
      <Row justify={'space-between'} align="middle">
        <Col>Enable Content Scheduling(Dripping)</Col>
        <Col>
          <Form.Item
            valuePropName="checked"
            name={['drip', 'enabled']}
            // label=""
          >
            <SwitchButton style={{ marginTop: 20 }} />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Text>
        Course items will be released gradually over time (e.g. every few days
        or once a week). You can learn more here.
      </Typography.Text>
      <Divider />
      <Row justify={'space-between'} align="middle">
        <Col>Enforce sequential learning path</Col>
        <Col>
          <Form.Item
            valuePropName="checked"
            name={['sequentialPath', 'enabled']}
            help
          >
            <SwitchButton style={{ marginTop: 20 }} />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Text>
        Course items can only be accessed in the sequential order. Learners need
        to mark course items as completed to move to next item. In an already
        published course, all previously completed items will remain accessible.
      </Typography.Text>
      <Divider />
      <Row justify={'space-between'} align="middle">
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
      </Typography.Text>

      <Space
        style={{
          paddingTop: 20,
          display: 'flex',
          flexDirection: 'row-reverse'
        }}
      >
        {' '}
        <Button type="primary" onClick={form.submit}>
          Submit
        </Button>
      </Space>
    </Form>
  )
}
