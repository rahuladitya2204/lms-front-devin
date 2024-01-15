import { Col, DatePicker, Form, Input, Row, Select, Space, Tag } from 'antd'

interface CampaignFormPropsI {
  // campaign: Types.Campaign;
  // updateCampaign: (d: Types.Campaign) => void;
}

const CampaignForm = (props: CampaignFormPropsI) => {

  return (
    <>
      <Form.Item
        name="title"
        label="Title"
        required
        rules={[
          { required: true, message: 'Please input the campaign title!' }
        ]}
      >
        <Input placeholder="Enter a title for the campaign" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: 'Please input the campaign description!' }
        ]}
      >
        <Input placeholder="Enter a description for the campaign" />
      </Form.Item>

      <Row>
        <Col span={24} />
        <Col span={24}>
          <Form.Item name="scheduledAt" label="Scheduled At">
            <DatePicker style={{ width: 200 }} />
          </Form.Item>
        </Col>
      </Row>

      <Space direction="horizontal">
        <Form.Item name="channel" required label="Campaign Channels">
          <Select
            mode="multiple"
            tagRender={e => <Tag color="blue">{e.label}</Tag>}
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
    </>
  )
}

export default CampaignForm
