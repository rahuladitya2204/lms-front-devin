import { Button, Card, Col, DatePicker, Form, Input, Radio, Row, Select, Space, Tag } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import Header from '@Components/Header'
import QuillEditor from '@Components/QuillEditor'
import RuleCreator from './RuleCreator/RuleCreator'
import Stepper from '@Components/Stepper'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

interface CreateCampaignComponentPropsI {
  children?: ReactNode;
  data?: Partial<Types.Campaign>;
  onFinish?: Function;
}

const CreateCampaign: React.FC<CreateCampaignComponentPropsI> = props => {
  const params = useParams();
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
            type:'success',
            content:'Saved'
          })
        }
      })
    } else {
      createCampaign(data, {
        onSuccess: (r) => {
          message.open({
            type:'success',
            content:'Saved'
          })
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

  const recipientsType = Form.useWatch(['recipients', 'type'], form);

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
                <Select
                  defaultValue={'email'}
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
          content: <>
             <Form.Item name={['recipients','type']}>
              <Radio.Group>
                <Radio value="entire">Entire Audience</Radio>
                <Radio value="segment">Segment</Radio>
                <Radio value="email-list">Email List</Radio>
              </Radio.Group>
            </Form.Item>
            {recipientsType==='email-list'?<Form.Item name={['recipients','emailList']}
              label="Email List" required>
                <Input placeholder="Enter receipients for the campaign" />
            </Form.Item> : null}
            {recipientsType === 'segment' ? <RuleCreator updateRule={updateRule} addRule={addRule} deleteRule={deleteRule} rules={rules} />:null}
          </>
          },
          {
            title: 'Template',
            content: <>
              <Form.Item label="Variables" >
                <Tag color="blue">Learner Name: {`{{name}}`}</Tag>
                <Tag color="blue">Contact No: {`{{contactNo}}`}</Tag>

</Form.Item>
            <Form.Item name="template" label="Template" required>
                <QuillEditor onChange={e => form.setFieldsValue({
                  template:e
                })} value={ props.data?.template} />
                </Form.Item>
            </>
          }
      ]}
    />
   </Card>
          </Col></Row></Header>
          </Form>
  
 )
}

export default CreateCampaign
