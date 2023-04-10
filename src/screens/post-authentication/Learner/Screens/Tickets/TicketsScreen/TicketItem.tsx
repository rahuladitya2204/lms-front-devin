import { Card, Divider, Space, Tag, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import dayjs from 'dayjs'

const { Text, Title } = Typography

interface TicketItemPropsI {
  ticket: Types.Ticket;
}

export default function TicketItem({ ticket }: TicketItemPropsI) {
  const { data: tickets } = Learner.Queries.useGetTickets()

  return (
    <Card
      title={
        <Space>
          <Text>{ticket.subject}</Text> <Divider type="vertical" />
          <Text>{dayjs(ticket.createdAt).format('LLLL')}</Text>
        </Space>
      }
      extra={<Tag color="green">IN PROGRESS</Tag>}
      style={{ width: '100%' }}
    >
      <Title style={{ marginTop: 0 }} level={4}>
        {ticket.subject}
      </Title>
      <Text>{ticket.category}</Text>
      <Text>{ticket.description}</Text>
    </Card>
  )
}
