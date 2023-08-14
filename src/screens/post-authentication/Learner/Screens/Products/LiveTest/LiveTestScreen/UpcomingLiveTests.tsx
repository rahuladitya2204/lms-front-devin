import { Avatar, Card, Col, List, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import { CalendarOutlined } from '@ant-design/icons'
import Image from '@Components/Image'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Meta } = Card
const { Text } = Typography

function UpcomingLiveTest(props: { filter: Types.GetLiveTestssFilter }) {
  const navigate = useNavigate()
  const {
    data,
    isLoading: loading
  } = Learner.Queries.useGetEnrolledProductList('live-test')
  return (
    <List
      grid={{
        gutter: 20,
        // xs: 1,
        // sm: 2,
        // md: 4,
        // lg: 4,
        // xl: 6,
        // xxl: 3
      }}
      dataSource={data}
      renderItem={({ product: { data: liveTest } }) => (
        <List.Item>
          <Card
            onClick={() => {
              navigate(liveTest?._id)
            }}
            style={{ width: 300 }}
            // @ts-ignore
            cover={<Image alt="example" src={liveTest.image} />}
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
              title={liveTest.title}
              description={
                <Text>Date: {dayjs(liveTest?.scheduledFor).format('LL')}</Text>
              }
              avatar={<CalendarOutlined />}
            />
          </Card>
        </List.Item>
      )}
    />
  )
}
export default UpcomingLiveTest
