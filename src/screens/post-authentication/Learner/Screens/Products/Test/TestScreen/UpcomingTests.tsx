import { Avatar, Badge, Card, Col, List, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import { CalendarOutlined } from '@ant-design/icons'
import Image from '@Components/Image'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Meta } = Card
const { Text } = Typography

function UpcomingTest(props: { filter: Types.GetTestsFilter }) {
  const navigate = useNavigate()
  const {
    data,
    isLoading: loading
  } = Learner.Queries.useGetEnrolledProductList('test')
  return (
    <List
      grid={{
        gutter: 20
        // xs: 1,
        // sm: 2,
        // md: 4,
        // lg: 4,
        // xl: 6,
        // xxl: 3
      }}
      dataSource={data}
      renderItem={({ product: { data: test } }) => {
        const CardComponent = (
          <Card
            onClick={() => {
              navigate(test?._id)
            }}
            style={{ width: 300 }}
            // @ts-ignore
            cover={<Image alt="example" src={test.image} />}
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
              title={test.title}
              description={
                <Text>Date: {dayjs(test?.scheduledFor).format('LL')}</Text>
              }
              avatar={<CalendarOutlined />}
            />
          </Card>
        )
        return (
          <List.Item>
            {/* @ts-ignore */}
            {test.product.data.isLive ? (
              <Badge.Ribbon text='live'>{CardComponent}</Badge.Ribbon>
            ) : (
              CardComponent
            )}
          </List.Item>
        )
      }}
    />
  )
}
export default UpcomingTest
