// @ts-nocheck
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Spin,
  Table,
  Tag
} from 'antd'
import { useEffect, useState } from 'react'

import EmailTemplatesScreen from './EmailTemplatesScreen';
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function EmailSettingScreen() {
  const [sender, setSender] = useState<{ notification: string; support:string}>({
    notification: '',
    support: '',
  });

  const [otp, setOtp] = useState({
    notification: '',
    support: '',
  })
  const message = useMessage()
  const {
    data: setting,
    isLoading: loadingSetting
  } = User.Queries.useGetOrgSetting()
  const {
    mutate: updateSetting,
    isLoading: updatingSetting
  } = User.Queries.useUpdateOrgSetting()

  const {
    mutate: verifyMailAddress,
    isLoading: verifyingMail
  } = User.Queries.useVerifyMailAddress()


  const {
    mutate: validateMailAddress,
    isLoading: validateingMail
  } = User.Queries.useValidateMailAddress()

  useEffect(
    () => {
      form.setFieldsValue(setting.communication)
    },
    [setting]
  )

  const [form] = Form.useForm()

  const onSubmit = (e: any) => {
    updateSetting(
      {
        data: {
          communication: e
        }
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved Setting'
          })
        }
      }
    )
  }

  const verifyMail = (data: { name: string, email: string, type: string }) => {
    verifyMailAddress(
      { data },
      {
        onSuccess: (d) => {
          console.log(d, 'd');
          setSender({
            ...sender,
            [data.type]: d.id
          })
          message.open({
            type: 'success',
            content: 'Verification Initiated.'
          })
        }
      }
    )
  }

  const renderVerify = (type:string) => {
    return !setting.communication.learner[type].verified ? <Tag color="green">Verified</Tag>
    : <Popover placement='left'
      content={
        <>
          <Form.Item
            label="Enter OTP"
            required
          >
            <Input onChange={e => setOtp({
              ...otp,
              [type]: e.target.value
            })} placeholder="Enter OTP sent on mail" />
          </Form.Item>
          <Button loading={validateingMail} onClick={() => validateMailAddress({
            data: {
              otp: otp[type],
              senderId: sender[type],
              type: type
            }
          }, {
            onSuccess: () => {
              message.open({
                type: 'success',
                content: 'Email has been verified'
              })
            }
          })} size='small'> Validate</Button>
        </>
      }
      title="Check your mail for OTP"
      trigger="click"
    >
      <Button
        onClick={() => {
          const {
            learner: { [type]: { email, name } }
          } = form.getFieldsValue(true);
          if (!sender[type]) {
            verifyMail({
              email,
              name,
              type: type
            });
          }
                  
        }}
        type="primary"
      >
        {sender[type] ? 'Check Mail for OTP' : 'Verify'}
      </Button>{' '}
    </Popover>
  };

  return (
    <Spin spinning={loadingSetting || updatingSetting || verifyingMail}>
      <Form
        form={form}
        initialValues={setting.communication}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Space direction="vertical" size={[20, 40]} style={{ width: '100%' }}>
          <Card
            title="Learner Notification Mail"
            extra={
            renderVerify('notification')
            }
          >
            <Form.Item
              name={['learner', 'notification', 'name']}
              label="Name"
              required
            >
              <Input placeholder="Name of the sender" />
            </Form.Item>
            <Form.Item
              name={['learner', 'notification', 'email']}
              label="Email"
              required
            >
              <Input placeholder="Email of the sender" />
            </Form.Item>
          </Card>

          <Card
            title="Learner Support Mail"
            extra={
              renderVerify('support')
              }

          >
            <Form.Item
              name={['learner', 'support', 'name']}
              label="Name"
              required
            >
              <Input placeholder="Name of the sender" />
            </Form.Item>
            <Form.Item
              name={['learner', 'support', 'email']}
              label="Email"
              required
            >
              <Input placeholder="Email of the sender" />
            </Form.Item>
          </Card>

          <Button onClick={form.submit}>Save</Button>
        </Space>
      </Form>
      <Card style={{ padding: 0,marginTop:20 }} title={'Email Templates'}>
        <EmailTemplatesScreen />
        </Card>
    </Spin>
  )
}

export default EmailSettingScreen
