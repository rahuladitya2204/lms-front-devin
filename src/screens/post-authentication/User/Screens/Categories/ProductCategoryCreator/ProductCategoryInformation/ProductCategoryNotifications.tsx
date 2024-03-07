import { Button, Checkbox, Col, DatePicker, Form, Input, Row } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import TextArea from '@Components/Textarea';
import { Title } from '@Components/Typography/Typography';

export default function ProductCategoryNotifications() {
  return (
    <Row>
      <Col span={24}>
        <Title>Notifications</Title>
        <Form.List name={['info','updates']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={[40, 0]}>
                  <Col span={4}>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      rules={[{ required: true, message: 'Missing Notifications title' }]}
                      label={`Notification ${name + 1} Title`}
                    >
                      <Input placeholder="Enter Notification title" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      rules={[{ required: true, message: 'Missing Notifications description' }]}
                      label={`Notification ${name + 1} Title`}
                    >
                   {/* @ts-ignore */}
                      <TextArea height={300} html={{level: 2}} name={[name, 'description']} placeholder="Enter Notification description" />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item
                      {...restField}
                      name={[name, 'date']}
                      rules={[{ required: true, message: 'Missing Notification date' }]}
                      label={`Notification ${name + 1} Date`}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item
                      {...restField}
                      name={[name, 'displayAsBanner']}
                      valuePropName="checked"
                      label={`Display as Banner`}
                    >
                      <Checkbox>Display as Banner</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <Button icon={<DeleteOutlined/>} danger onClick={() => remove(name)}>
                      
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Notification
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Col>
    </Row>
  );
}
