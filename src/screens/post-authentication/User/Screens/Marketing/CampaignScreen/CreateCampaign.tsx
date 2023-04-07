import { Button, Col, Form, Input, Radio, Row, Select } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import Header from '@Components/Header'
import QuillEditor from '@Components/QuillEditor'
import RuleCreator from './RuleCreator/RuleCreator'
import Stepper from '@Components/Stepper'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

interface CreateCampaignComponentPropsI {
  children?: ReactNode;
  data?: Partial<Types.Campaign>;
  onFinish?: Function;
}

const CreateCampaign: React.FC<CreateCampaignComponentPropsI> = props => {
  const params = useParams();
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

  const onSubmit = (e: Partial<Types.Campaign>) => {
    const recipients = form.getFieldValue(['recipients']);
    const data = {
      ...e,
      recipients
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
  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  useEffect(
    () => {
      console.log('setting',campaign)
      form.setFieldsValue(campaign)
    },
    [campaign]
  )
  const recipientsType = Form.useWatch(['recipients', 'type'], form);
  const recipientsRule = form.getFieldValue(['recipients', 'rule']);
  // console.log(recipientsRule, 'huhuh');
  return (
    <Form form={form} onFinish={onSubmit} layout="vertical" initialValues={Constants.INITIAL_CAMPAIGN_DETAILS}>
    <Header
    title="Create Campaign"
      extra={[
      // @ts-ignore
      <Button loading={createCampaignLoading | updateCampaignLoading} type="primary" onClick={form.submit} >Save Campaign </Button>
    ]}
  >
    <Row gutter={[16, 16]}>
        <Col span={24}>
    <Stepper
      steps={[
        {
          title: 'Title',
          content: (
            <>
             <Form.Item name="title" label="Campaign Title" required>
                <Input placeholder="Enter a title for the campaign" />
              </Form.Item>

              <Form.Item name="channel" label="Campaign Channels" required>
                <Select  mode='multiple'
                  defaultValue={["email"]}
                  style={{ width: 300 }}
                  options={[
                    { value: 'email', label: 'Email' },
                    { value: 'whatsapp', label: 'Whatsapp' },
                    { value: 'push', label: 'Push Notification' },
                    { value: 'sms', label: 'SMS' }
                  ]}
                />{' '}
              </Form.Item>

              <Form.Item name="subject" label="Campaign Subject" required>
                <Input placeholder="Enter a subject for the campaign" />
              </Form.Item>
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
            {recipientsType==='segment'?<RuleCreator form={form} rules={recipientsRule} updateRules={(rules)=>form.setFieldValue(['recipients','rule'],rules)}/>:null}
          </>
          },
          {
            title: 'Template',
            content: <>
            
            <Form.Item name="template" label="Template" required>
                <QuillEditor onChange={e => form.setFieldsValue({
                  template:e
                })} value={ props.data?.template} />
                </Form.Item>
            </>
          }
      ]}
    />
          </Col></Row></Header>
          </Form>
  
 )
}

export default CreateCampaign
