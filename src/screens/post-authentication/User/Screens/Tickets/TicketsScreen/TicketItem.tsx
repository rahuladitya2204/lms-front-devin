// @ts-nocheck

import { Card, Divider, Space, Tag, Typography } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import { StatusMap } from '@User/Screens/Tickets/Constants'
import dayjs from 'dayjs'

const { Text, Title } = Typography

interface TicketItemPropsI {
  ticket: Types.Ticket;
}

export default function TicketItem({ ticket }: TicketItemPropsI) {
  const { data: tickets } = User.Queries.useGetTickets()

  return (
    <Card
      title={
        <Space>
          <Text>{ticket.id}</Text> <Divider type="vertical" /> <Text>Category: {ticket.category}</Text>{' '}
          <Divider type="vertical" />
          <Text>{dayjs(ticket.createdAt).format('LLLL')}</Text>
        </Space>
      }
      extra={
        ticket.status ? (
          <Tag color={StatusMap[ticket.status].color}>
            {StatusMap[ticket.status].text.toUpperCase()}
          </Tag>
        ) : null
      }
      style={{ width: '100%' }}
    >
      <Title style={{ marginTop: 0 }} level={4}>
        {ticket.subject}
      </Title>
      {/* <Text>{ticket.category}</Text> */}
      <Text>{ticket.description}</Text>
    </Card>
  )
}
