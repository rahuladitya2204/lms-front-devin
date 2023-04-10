// @ts-nocheck

import { Card, Divider, Space, Tag, Typography } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import FileList from '@Components/FileList'
import { StatusMap } from '@User/Screens/Tickets/Constants'
import dayjs from 'dayjs'

const { Text, Title } = Typography

interface TicketItemPropsI {
  ticket: Types.Ticket;
  hideAttachments?: boolean;
}

export default function TicketItem({ ticket,hideAttachments }: TicketItemPropsI) {
  return (
    <Card
      title={
        <Space>
          <Text>{ticket.id}</Text> <Divider type="vertical" />{' '}
          <Text>Category: {ticket.category}</Text> <Divider type="vertical" />
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
      <Space direction="vertical">
        <Title style={{ marginTop: 0 }} level={4}>
          {ticket.subject}
        </Title>
        <Text>{ticket.category}</Text>
        <Text>{ticket.description}</Text>
        {!hideAttachments?<><Divider style={{ width: '100%' }} />
        <Space direction="vertical">
          <Title style={{ marginTop: 0 }} level={4}>
            Attachments
          </Title>
          <FileList files={ticket.files} />
        </Space></>:null}
        
      </Space>
    </Card>
  )
}
