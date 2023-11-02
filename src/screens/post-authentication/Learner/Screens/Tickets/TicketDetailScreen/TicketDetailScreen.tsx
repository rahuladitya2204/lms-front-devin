import { Avatar, Button, Card, Col, Form, Input, List, Row, Skeleton, Tooltip, Typography, theme } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'

import { Comment } from '@ant-design/compatible';
import TicketItem from '../TicketsScreen/TicketItem';
import { useParams } from 'react-router';
import TextArea from '@Components/Textarea';

const { useToken } = theme

const { Text, Title } = Typography

// interface TicketDetailPropsI {
//   ticket: Types.Ticket;
// }

export default function TicketDetail() {
  const { token } = useToken()
    const [form] = Form.useForm()
    const { id } = useParams();
    const { data: ticket ,isLoading: loadingTicket} = Learner.Queries.useGetTicketDetails(id + '');
  const createdBy = ((ticket.createdBy as unknown as Types.Learner) || {});
  const name = (createdBy?.name+'').split(' ').map(n => n[0].toUpperCase()).join('');
    const { mutate: replyToTicket,isLoading: postingReply } = Learner.Queries.useReplyToTicket();
    
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
      {loadingTicket ? <Card title={<><Skeleton.Button style={{ marginLeft: 20, width: 100 }} />
        <Skeleton.Button style={{ marginLeft: 20, width: 100 }} />
        <Skeleton.Button style={{ marginLeft: 20, width: 100 }} />
        <Skeleton.Button style={{ marginLeft: 20, width: 100 }} /></>}>
        <Skeleton/>
      </Card> : <TicketItem ticket={ticket} />}
      
      {loadingTicket ? <Card style={{ marginTop: 20 }}>
        <Row gutter={[20,20]}>
          <Col span={24}>
            <Skeleton.Input block size='large' />
          </Col>
          <Col span={24}>
          <Skeleton.Button/>
          </Col>
          <Col span={24}>
            <Skeleton paragraph={{ rows: 1 }} />
          </Col>
          <Col span={24}>
            <Skeleton.Avatar/>
          </Col>
          <Col span={24}>
            <Skeleton.Avatar/>
          </Col>
          <Col span={24}>
            <Skeleton.Avatar/>
          </Col>
          <Col span={24}>
            <Skeleton.Avatar/>
          </Col>
        </Row>

      </Card>:    <Card style={{ marginTop:20}}>
              <Form form={form} layout='vertical' onFinish={postReply}>
              <Form.Item name='message' label='Reply'>
              <TextArea html={{level:1}} height={100} rows={4} placeholder='Post a reply' />
                  </Form.Item>
                  <Button  loading={postingReply}       key="submit"
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
                  author={<Text strong>{isFromSupportAgent?'Support Agent':createdBy.name }</Text>}
                  avatar={
                    <Avatar style={{ backgroundColor: token.colorPrimary }} >
                      {isFromSupportAgent?'SA':name}
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
            )
          }}
        /></>
       
      ) : null}
          </Card>}
      
      </>
  )
}
