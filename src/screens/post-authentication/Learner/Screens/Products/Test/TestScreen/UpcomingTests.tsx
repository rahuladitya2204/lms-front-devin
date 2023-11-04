import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  List,
  Row,
  Skeleton,
  Tag,
  Typography
} from 'antd'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Learner, Types, Utils } from '@adewaskar/lms-common'

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
  if (loading) {
    const SkeletonArr = [1, 1, 1, 1, 1, 1, 1, 1]
    return (
      <Row gutter={[60, 100]}>
        {SkeletonArr.map(() => (
          <Col span={6}>
            <Card>
              <Skeleton active paragraph />
              <Skeleton.Avatar />
              {/* <Row justify={'space-between'}>
                <Col>
                  <Skeleton.Button style={{ marginTop: 20 }} block />
                </Col>
                <Col>
                  <Skeleton.Button style={{ marginTop: 20 }} block />
                </Col>
                <Col>
                  <Skeleton.Button style={{ marginTop: 20 }} block />
                </Col>
              </Row>{' '} */}
            </Card>{' '}
          </Col>
        ))}
      </Row>
    )
  }
  return (
    <List
      grid={{
        gutter: 20,
        column: 4
        // xs: 1,
        // sm: 2,
        // md: 4,
        // lg: 4,
        // xl: 6,
        // xxl: 3
      }}
      dataSource={data.filter(pd => {
        return !(pd.product?.data?.endedAt || pd.metadata.test.endedAt)
      })}
      renderItem={({ product: { data: test } }) => {
        const formattedDuration = Utils.formatTime(test?.duration*60)
  const CardComponent = (
          <Card
            onClick={() => {
              navigate(test?._id)
            }}
            // style={{ width: 300 }}
            // @ts-ignore
            cover={<Image height={200} alt="example" src={test.thumbnailImage} />}
            actions={
              [
                // <Button block>View Result</Button>
              ]
            }
          >
            <Meta
              // avatar={
              //   <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
              // }
              title={
                <Text>
                  {/* @ts-ignore */}
                  {test.title}{' '}
                  {test?.isLive ? <Tag color="cyan">Live Test</Tag> : null}{' '}
                </Text>
              }
              description={
                <>
                  <Tag icon={<ClockCircleOutlined/>} >{formattedDuration}</Tag>
                  {test?.scheduledAt ? (
                  <Text>Date: {dayjs(test?.scheduledAt).format('LLL')}</Text>
                ) : (
               ''
                ) }</>
              }
              avatar={<CalendarOutlined />}
            />
          </Card>
        )
        return (
          <List.Item>
            {/* @ts-ignore */}
            {test?.product?.data?.isLive ? (
              <Badge.Ribbon text="live">{CardComponent}</Badge.Ribbon>
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
