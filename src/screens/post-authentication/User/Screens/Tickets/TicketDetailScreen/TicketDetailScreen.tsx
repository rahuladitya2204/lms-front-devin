import { Avatar, Button, Card, Col, Divider, Form, Input, List, Row, Skeleton, Space, Spin, Tag, Tooltip, theme } from 'antd'
import { Store, Types, User } from '@adewaskar/lms-common'

import { Comment } from '@ant-design/compatible';
import Header from '@Components/Header';
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer';
import TextArea from '@Components/Textarea';
import TicketItem from '../TicketsScreen/TicketItem';
import { Typography } from '@Components/Typography';
import dayjs from 'dayjs';
import { useParams } from '@Router/index';

const { useToken } = theme

const { Text, Title } = Typography

// interface TicketDetailPropsI {
//   ticket: Types.Ticket;
// }

export default function TicketDetail() {
  const { id } = useParams();
  const { data: ticket,isLoading:loading } = User.Queries.useGetTicketDetails(id + '');
  const createdBy = ticket.createdBy as unknown as Types.Learner;
  const { token } = useToken();
  console.log(createdBy,'createdBy')
  const name = createdBy?(createdBy?.name[0]):''
    const [form] = Form.useForm()

    const { mutate: replyToTicket,isLoading: postingReply } = User.Queries.useReplyToTicket();
    
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
      {loading ? <>
       
        <Card><Skeleton /></Card>
        <Card style={{ marginTop: 20 }}>
        <Row>
          <Col span={24}>
          <Skeleton.Input style={{height: 50}} block size='large'/>
            </Col>
            <Col span={24}>
          <Skeleton style={{width: '100%'}} paragraph={{rows: 1}}/>
            </Col>
            <Col span={24}>
            <Skeleton style={{width: '100%'}} paragraph={{rows: 1}}/>
            </Col>
            <Col span={24}>
            <Skeleton style={{width: '100%'}} paragraph={{rows: 1}}/>
            </Col>
            <Col span={24}>
            <Skeleton style={{width: '100%'}} paragraph={{rows: 1}}/>
            </Col>
            <Col span={24}>
            <Skeleton style={{width: '100%'}} paragraph={{rows: 1}}/>
          </Col>
        </Row>

</Card>
      </> : <>
      <TicketItem ticket={ticket} />  <Card style={{ marginTop:20}}>
              <Form form={form} layout='vertical' onFinish={postReply}>
              <Form.Item name='message' label='Reply'>
              <TextArea html={{level: 1}} height={100} placeholder='Post a reply' />
                  </Form.Item>
                  <Button    loading={postingReply}     key="submit"
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
                author={<Text strong>{isFromSupportAgent?'Me':createdBy?.name }</Text>}
                avatar={
                  <Avatar style={{ backgroundColor: token.colorPrimary}} >
                  {isFromSupportAgent?'ME':name}
                </Avatar>

                }
                content={
                  <HtmlViewer content={ item.message} />
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
        </Card></>}
       
        
      </Header>
  )
}
