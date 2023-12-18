import { Avatar, Card, Typography } from 'antd'

import React from 'react'
import { Types } from '@adewaskar/lms-common'
import { UserOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

interface TestimonialCardProps {
  testimonial: Types.Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
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
      <Title level={4}>{testimonial.name}</Title>
      <Title level={5} type="secondary">
        {testimonial.designation}
      </Title>
      <Paragraph style={{ marginTop: 16 }}>{testimonial.testimonial}</Paragraph>
    </Card>
  )
}

export default TestimonialCard
