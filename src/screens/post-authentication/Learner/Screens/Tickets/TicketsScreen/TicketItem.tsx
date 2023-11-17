// @ts-nocheck
import { Card, Divider, Space, Tag, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import FileList from '@Components/FileList'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import { StatusMap } from '@Learner/Screens/Tickets/Constants'
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
          <Text> {ticket.category.title}</Text> <Divider type="vertical" /> 
          {(ticket?.subCategory)?<><Text> {ticket?.subCategory?.title}</Text> <Divider type="vertical" /> </>:null}
          
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

        <HtmlViewer>{ticket.description}</HtmlViewer>
        {(!hideAttachments && ticket.files.length)?<><Divider style={{ width: '100%' }} />
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
