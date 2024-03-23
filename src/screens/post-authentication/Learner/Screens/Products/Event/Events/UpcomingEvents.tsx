import { Avatar, Card, Col, List, Row, Space, Table } from 'antd'
import { Learner, Types } from '@invinciblezealorg/lms-common'

import Image from '@Components/Image'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Meta } = Card

function UpcomingEvent(props: { filter: Types.GetEventsFilter }) {
  const { data, isFetching: loading } = Learner.Queries.useGetEvents(
    props.filter
  )
  const navigate = useNavigate()
  console.log(data, 'data')
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3
      }}
      dataSource={data}
      renderItem={item => (
        <List.Item
          onClick={() => {
            // @ts-ignore
            navigate(item.product.id)
          }}
        >
          <Card
            style={{ width: 300 }}
            cover={
              <Image
                alt="example"
                // src={item.image}
              />
            }
            // actions={[
            //   <SettingOutlined key="setting" />,
            //   <EditOutlined key="edit" />,
            //   <EllipsisOutlined key="ellipsis" />
            // ]}
          >
            <Meta
              // avatar={
              //   <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
              // }
              // @ts-ignore
              title={item.product.data.title}
              // @ts-ignore
              description={dayjs(item.product.data.scheduledAt).format('LLL')}
            />
          </Card>
        </List.Item>
      )}
    />
  )
}
export default UpcomingEvent
