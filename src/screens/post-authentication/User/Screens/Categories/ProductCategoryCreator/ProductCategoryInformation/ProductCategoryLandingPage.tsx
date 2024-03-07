import { Col, Form, Row } from 'antd'

import TextArea from '@Components/Textarea'

export default function ProductCategoryLandingPage () {
  return (
    <Row>
      <Col span={24}>
        <Form.Item label="Description">
          <TextArea
            height={600}
            html={{ level: 3 }}
            name={['landingPage', 'description']}
          />
        </Form.Item>
      </Col>
    </Row>
  )
}
