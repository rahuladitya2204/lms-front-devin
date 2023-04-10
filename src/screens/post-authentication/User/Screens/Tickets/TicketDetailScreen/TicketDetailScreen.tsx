import { Avatar, Button, Card, Divider, Form, Input, List, Space, Tag, Tooltip, Typography, theme } from 'antd'
import { Store, Types, User } from '@adewaskar/lms-common'

import { Comment } from '@ant-design/compatible';
import Header from '@Components/Header';
import TicketItem from '../TicketsScreen/TicketItem';
import dayjs from 'dayjs';
import { useParams } from 'react-router';

const { useToken } = theme

const { Text, Title } = Typography

// interface TicketDetailPropsI {
//   ticket: Types.Ticket;
// }

export default function TicketDetail() {
  const { id } = useParams();
  const { data: ticket } = User.Queries.useGetTicketDetails(id + '');
  const createdBy = ticket.createdBy as unknown as Types.Learner;
  const { token } = useToken();
  const name = (createdBy.name+'').split(' ').map(n => n[0].toUpperCase()).join('');
    const [form] = Form.useForm()

    const { mutate: replyToTicket } = User.Queries.useReplyToTicket();
    
    const postReply = ({ message }:Partial<Types.TicketReply>) => {
        replyToTicket({
            id: id+'',
            data: {
                message
            }
        }, {
            onSuccess: () => {
                form.resetFields();
            }
        })
    }

  return (
    <Header hideBack
      title={<Text>Support Ticket: {ticket.id}</Text> }
    >
        <TicketItem ticket={ticket}/>
          <Card style={{ marginTop:20}}>
              <Form form={form} layout='vertical' onFinish={postReply}>
              <Form.Item name='message' label='Reply'>
              <Input.TextArea rows={4} placeholder='Post a reply' />
                  </Form.Item>
                  <Button         key="submit"
 type='primary' onClick={form.submit}> Reply</Button>
              </Form>
              

              {ticket.replies.length ? (<>
                
                <List
          className="comment-list"
                      header={<Title level={5}> { ticket.replies.length} Replies</Title>}
          itemLayout="horizontal"
          dataSource={ticket.replies}
            renderItem={item => {
              const isFromSupportAgent = item.user;
              return (
            <li>
              <Comment
                // actions={actions}
                author={<Text strong>{isFromSupportAgent?'Me':createdBy.name }</Text>}
                avatar={
                  <Avatar style={{ backgroundColor: token.colorPrimary}} >
                  {isFromSupportAgent?'ME':name}
                </Avatar>

                }
                content={
                  <div dangerouslySetInnerHTML={{ __html: item.message }} />
                }
                datetime={
                  <Tooltip title="2016-11-22 11:22:33">
                    <span>8 hours ago</span>
                  </Tooltip>
                }
              />
            </li>
          )}}
        /></>
       
      ) : null}
          </Card>
      </Header>
  )
}
