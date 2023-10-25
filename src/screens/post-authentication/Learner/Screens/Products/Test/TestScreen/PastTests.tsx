import { Avatar, Button, Card, Col, List, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import { CalendarOutlined } from '@ant-design/icons'
import Image from '@Components/Image'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Meta } = Card
const { Text } = Typography

function PastTest(props: { filter: Types.GetTestsFilter }) {
  const navigate = useNavigate()
  const {
    data,
    isLoading: loading
  } = Learner.Queries.useGetEnrolledProductList('test')

  return (
    <List
      grid={{
        gutter: 20
      }}
      dataSource={data}
      renderItem={({ product: { data: test }, metadata }) => {
        const isTestAttempted = metadata.test.startedAt && metadata.test.endedAt

        return (
          <List.Item>
            <Card
              // onClick={() => {
              //   navigate(test?._id)
              // }}
              style={{ width: 300 }}
              // @ts-ignore
              cover={<Image alt="example" src={test.image} />}
              actions={[
                isTestAttempted ? (
                  <Button
                    onClick={() => {
                      navigate(`${test?._id}/result`)
                    }}
                    style={{ marginLeft: 10, marginRight: 10 }}
                    block 
                  >
                    View Result
                  </Button>
                ) : null
              ]}
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
          </List.Item>
        )
      }}
    />
  )
}
export default PastTest
