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
import NoItemFound from '@Components/NoItemFound'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Meta } = Card
const { Text,Title } = Typography

function UpcomingTest(props: { filter: Types.GetTestsFilter }) {
  const navigate = useNavigate()
  const {
    data,
    isFetching: loading, isLoading: loadingFirst
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
  const upcomingTests = data.filter(pd => {
    return !(pd.product?.data?.endedAt || pd.metadata.test.endedAt)
  });

  if (!upcomingTests.length && !loadingFirst) {
    return <NoItemFound  cta={'Check them out!'} text='No pasts tests yet. Lets get enrolled for one!' />

  }
  return (
      <Row gutter={[20, 10]}>
    {/* @ts-ignore */}
      {upcomingTests.map(({ product: { data: test } }:{ product: { data: Types.Test } }) => {
        const formattedDuration = test.duration.enabled?(Utils.formatTime(test?.duration.value*60)):null
  const CardComponent = (
          <Card hoverable
            onClick={() => {
             // @ts-ignore
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
                 {formattedDuration? <Tag icon={<ClockCircleOutlined/>} >{formattedDuration}</Tag>:null}
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
          // @ts-ignore
          <Col xs={24} sm={12} md={8} lg={6} > {test?.product?.data?.isLive ? (
            <Badge.Ribbon text="live">{CardComponent}</Badge.Ribbon>
          ) : (
            CardComponent
          )}</Col>
        )
      })}
      

</Row>


  )
}
export default UpcomingTest
