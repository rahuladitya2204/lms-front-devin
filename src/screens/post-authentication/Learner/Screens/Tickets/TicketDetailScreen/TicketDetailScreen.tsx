import { Avatar, Button, Card, Col, Form, Input, List, Row, Skeleton, Spin, Tooltip, theme } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'

import { Comment } from '@ant-design/compatible';
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
  const { token } = useToken()
    const [form] = Form.useForm()
    const { id } = useParams();
    const { data: ticket ,isFetching: loadingTicket,isLoading: loadingTicketFirst} = Learner.Queries.useGetTicketDetails(id + '');
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
      {loadingTicketFirst ? <Card title={<><Skeleton.Button style={{ marginLeft: 20, width: 100 }} />
        <Skeleton.Button style={{ marginLeft: 20, width: 100 }} />
        <Skeleton.Button style={{ marginLeft: 20, width: 100 }} />
        <Skeleton.Button style={{ marginLeft: 20, width: 100 }} /></>}>
        <Skeleton/>
      </Card> : <TicketItem ticket={ticket} />}
      
      {loadingTicketFirst ? <Card style={{ marginTop: 20 }}>
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

          {loadingTicketFirst ? <><Skeleton avatar paragraph={{ rows: 4 }} /></> : <>
          {ticket.replies.length ? (<>
                
              <Spin spinning={loadingTicket}>
              <List
          className="comment-list"
                      header={<Title level={5}> { ticket.replies.length} Replies</Title>}
                  itemLayout="horizontal"
                  // @ts-ignore
          dataSource={ticket.replies.sort((a,b)=>b.date-a.date)}
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
                      <span>{dayjs(item.date).fromNow() }</span>
                    </Tooltip>
                  }
                />
              </li>
            )
          }}
              />
              </Spin>
            </>
      ) : null}
          </>}      

             
          </Card>}
      
      </>
  )
}
