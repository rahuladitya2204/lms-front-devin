import { Button, Card, Col, DatePicker, Form, Input, Radio, Row, Select, Space, Tabs, Tag } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import AddRecipients from './AddRecipients/AddReciepients'
import CreateEmailTemplate from './CreateTemplate/CreateEmailTemplate'
import Header from '@Components/Header'
import QuillEditor from '@Components/QuillEditor'
import RuleCreator from './RuleCreator/RuleCreator'
import Stepper from '@Components/Stepper'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import useMessage from '@Hooks/useMessage'

interface CreateCampaignComponentPropsI {
  children?: ReactNode;
  data?: Partial<Types.Campaign>;
  onFinish?: Function;
}

const CreateCampaign: React.FC<CreateCampaignComponentPropsI> = props => {
  const params = useParams();
  const navigate = useNavigate();
  const [rules, setRules] = useState<Types.Rule[]>([]);
  const message = useMessage();
  const {
    mutate: createCampaign,
    isLoading: createCampaignLoading
  } = User.Queries.useCreateCampaign()
  const {
    mutate: updateCampaign,
    isLoading: updateCampaignLoading
  } = User.Queries.useUpdateCampaign();

  const { data: campaign } = User.Queries.useGetCampaignDetails(params.id+'', {
    enabled:!!params.id
  })

  const [form] = Form.useForm();
  const isFormValid = !form.getFieldsError().some(({ errors }) => errors.length);
  // console.log(form.getFieldsError(),'isValid')
  const onSubmit =  (e: Partial<Types.Campaign>) => {
    if (!isFormValid) {
      return;
    }
    const recipients = form.getFieldValue(['recipients']);
    const data = {
      ...e,
      recipients: {...recipients,rule:rules},
      status:'draft'
    }
    if (campaign._id) {
      updateCampaign({ id: campaign._id, data: data }, {
        onSuccess: (r) => {
          message.open({
            type: 'success',
            content: 'Campaign Draft Saved'
          });
          // navigate('../campaign')
        }
      })
    } else {
      createCampaign(data, {
        onSuccess: (r) => {
          message.open({
            type: 'success',
            content: 'Saved'
          });
          navigate('../campaign')
        }
      })
    }
    // onFinish && onFinish(e)
  }
  // console.log(form.getFieldValue(),'ll')

  const addRule = () => {
    const RULES: any[] = [...rules]
    RULES.push({
      operand: 'email',
      operator: '',
      value: ''
    })
    setRules(RULES)
  }

  const updateRule = (index: number, type: string, value: string) => {
    const RULES: any[] = [...rules]
    RULES[index][type] = value
    setRules(RULES)
  }

  const deleteRule = (index: number) => {
    const RULES: any[] = [...rules]
    RULES.splice(index, 1)
    setRules(RULES)
  }

  useEffect(
    () => {
      // setRules(props.data?.recipients?.rule)
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  useEffect(
    () => {
      setRules(campaign?.recipients?.rule)
      form.setFieldsValue(campaign)
    },
    [campaign]
  )

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical" initialValues={Constants.INITIAL_CAMPAIGN_DETAILS}>
    <Header
    title="Create Campaign"
      extra={[
      <Button disabled={!isFormValid} loading={createCampaignLoading || updateCampaignLoading}  onClick={form.submit} >Save Draft </Button>
    ]}
  >
    <Row gutter={[16, 16]}>
        <Col span={24}>
            <Card>
            <Stepper
      steps={[
        {
          title: 'Title',
          content: (
            <>
             <Form.Item name="title" label="Campaign Title" required>
                <Input placeholder="Enter a title for the campaign" />
              </Form.Item>

              <Form.Item name="subject" label="Campaign Subject" >
                <Input placeholder="Enter a subject for the campaign" />
              </Form.Item>
              <Space direction='horizontal'>
              <Form.Item name="channel" label="Campaign Channels" >
                <Select mode='multiple'
                  defaultValue={['email']}
                  style={{ width: 300 }}
                  options={[
                    { value: 'email', label: 'Email' },
                    { value: 'whatsapp', label: 'Whatsapp' },
                    { value: 'push', label: 'Push Notification' },
                    { value: 'sms', label: 'SMS' }
                  ]}
                />{' '}
              </Form.Item>

              {/* <Form.Item name="scheduledAt" label="Scheduled For" required>
              <DatePicker 
              style={{ width: 300 }} name="scheduledAt"
              value={scheduledAt ? dayjs(scheduledAt) : null}
            />
              </Form.Item> */}
             </Space>

            </>
          )
          }, {
          title: 'Recipients',
          content: <AddRecipients form={form} data={props.data} addRule={addRule} deleteRule={deleteRule} updateRule={updateRule} rules={rules} />
          },
          {
            title: 'Template',
            content:<Tabs defaultActiveKey="1" items={[  {
              key: '1',
              label: `Email`,
              children: <CreateEmailTemplate form={form} data={props.data} />
            },]}/>
          }
      ]}
    />
   </Card>
          </Col></Row></Header>
          </Form>
  
 )
}

export default CreateCampaign
