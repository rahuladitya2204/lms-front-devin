import { Avatar, Card, Col, Rate, Row, Typography } from 'antd'

import React from 'react'
import { Types } from '@adewaskar/lms-common'
import { UserOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

interface TestimonialCardProps {
  testimonial: Types.Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const blockQuoteStyle = {
    fontStyle: 'italic',
    borderLeft: '4px solid #ccc',
    margin: '1em 10px',
    padding: '0.5em 10px',
    backgroundColor: '#f9f9f9'
  }

  return (
    <Card
      style={{ textAlign: 'center', marginTop: 16 }}
      bodyStyle={{ paddingTop: 0 }}
      cover={
        <Avatar
          src={testimonial.image}
          icon={<UserOutlined />}
          size={128}
          style={{ margin: '16px auto' }}
        />
      }
    >
      <Row>
        <Col span={24}>
          <Title level={4}>{testimonial.name}</Title>
        </Col>
        {/* <Col span={24}>
          <Title level={5} type="secondary">
            {testimonial.designation}
          </Title>{' '}
        </Col> */}
        <Col span={24}>
          <Rate
            disabled
            direction="hozirontal"
            style={{ width: '100%' }}
            value={testimonial.rating}
          />
        </Col>
        <Col span={24}>
          <Paragraph style={{ marginTop: 16 }}>
            <blockquote style={blockQuoteStyle}>
              {testimonial.testimonial}
            </blockquote>
          </Paragraph>
        </Col>
      </Row>
    </Card>
  )
}

export default TestimonialCard
