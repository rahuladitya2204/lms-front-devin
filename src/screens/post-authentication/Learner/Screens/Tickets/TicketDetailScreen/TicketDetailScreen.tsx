import { Avatar, Button, Card, Form, Input, List, Tooltip, Typography } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'

import { Comment } from '@ant-design/compatible';
import TicketItem from '../TicketsScreen/TicketItem';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import { useParams } from 'react-router';

const { Text, Title } = Typography

// interface TicketDetailPropsI {
//   ticket: Types.Ticket;
// }

export default function TicketDetail() {
  const user = Store.useAuthentication(s => s.user);
  const name = (user.name+'').split(' ').map(n => n[0].toUpperCase()).join('');
    const [form] = Form.useForm()
    const { id } = useParams();
    const { data: ticket } = Learner.Queries.useGetTicketDetails(id + '');

    const { mutate: replyToTicket } = Learner.Queries.useReplyToTicket();
    
    const postReply = ({ message }:Partial<Types.TicketReply>) => {
        console.log(message,'message')
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
      <>
          <TicketItem ticket={ticket} />
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
          renderItem={item => (
            <li>
              <Comment
                // actions={actions}
                author={<Text strong>Aditya Dewaskar</Text>}
                avatar={
                  <Avatar style={{ backgroundColor: '#87d068' }} >
                    { name}
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
          )}
        /></>
       
      ) : null}
          </Card>
      </>
  )
}
