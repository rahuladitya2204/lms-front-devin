import { Form, Input, Select, Space, Tag } from 'antd'

import { Types } from '@adewaskar/lms-common'
import { deepPatch } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useLayoutEffect } from 'react'

interface CampaignFormPropsI {
  campaign: Types.Campaign;
  updateCampaign: (d: Types.Campaign) => void;
}

const CampaignForm = (props: CampaignFormPropsI) => {
  const [form] = Form.useForm()

  useLayoutEffect(
    () => {
      form.setFieldsValue(props.campaign)
    },
    [[props.campaign]]
  )

  return (
    <Form
      form={form}
      onValuesChange={d => {
        const data = deepPatch(props.campaign, d)
        props.updateCampaign(data)
      }}
      layout="vertical"
    >
      <Form.Item name="title" label="Campaign Title" required>
        <Input placeholder="Enter a title for the campaign" />
      </Form.Item>

      <Form.Item name="description" label="Campaign Description">
        <Input placeholder="Enter a description for the campaign" />
      </Form.Item>

      <Space direction="horizontal">
        <Form.Item name="channel" label="Campaign Channels">
          <Select
            mode="multiple"
            onChange={e =>
              form.setFieldsValue({
                channel: e
              })
            }
            tagRender={e => <Tag color='blue'>{e.label}</Tag>}
            style={{ width: 450 }}
            options={[
              { value: 'email', label: 'Email' },
              { value: 'whatsapp', label: 'Whatsapp' },
              { value: 'push', label: 'Push Notification' },
              { value: 'sms', label: 'SMS' }
            ]}
          />
        </Form.Item>

        {/* <Form.Item name="scheduledAt" label="Scheduled For" required>
      <DatePicker
      style={{ width: 300 }} name="scheduledAt"
      value={scheduledAt ? dayjs(scheduledAt) : null}
    />
      </Form.Item> */}
      </Space>
    </Form>
  )
}

export default CampaignForm
