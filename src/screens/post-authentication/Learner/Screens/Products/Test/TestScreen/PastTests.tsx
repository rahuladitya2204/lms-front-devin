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
import { CalendarOutlined, EditOutlined } from '@ant-design/icons'
import { Learner, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import NoItemFound from '@Components/NoItemFound'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Meta } = Card
const { Text } = Typography

function PastTest(props: { filter: Types.GetTestsFilter }) {
  const navigate = useNavigate()
  const {
    data,
    isFetching: loading,
    isLoading: loadingFirst
  } = Learner.Queries.useGetEnrolledProductList('test')
  const pastTests = data.filter(pd => {
    return pd.product?.data?.endedAt || pd.metadata.test.endedAt
  })
  if (!pastTests.length && !loadingFirst) {
    return <NoItemFound text="No past tests yet. Lets get enrolled for one!" />
  }
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
    <Row gutter={[20, 30]}>
      {pastTests.map(({ product: { data: test }, metadata }) => {
        const testStartDate = metadata.test.startedAt || test?.live?.startedAt
        const testEndDate = metadata.test.endedAt || test?.live?.endedAt
        const isTestAttempted = metadata.test.startedAt && metadata.test.endedAt
        const CardComponent = (
          <Card
            hoverable
            onClick={() => {
              navigate(test?._id)
            }}
            // style={{ width: 300 }}
            // @ts-ignore
            cover={
              <Image height={200} alt="example" src={test?.thumbnailImage} />
            }
            // actions={[
            //   isTestAttempted ? (
            //     testEndDate ? (
            //       <Button
            //         onClick={() => {
            //           navigate(`${test?._id}/result`)
            //         }}
            //         // style={{ marginLeft: 10, marginRight: 10 }}
            //         // block
            //       >
            //         View Result
            //       </Button>
            //     ) : null
            //   ) : null
            // ]}
          >
            <Meta
              // avatar={
              //   <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
              // }
              // @ts-ignore
              title={test.title}
              description={<Tag>{dayjs(testStartDate).format('LLL')}</Tag>}
              avatar={<EditOutlined />}
            />
          </Card>
        )
        return (
          <Col xs={24} sm={12} md={8} lg={6}>
            {test?.live.enabled ? (
              <Badge.Ribbon text={`Live`} color="red">
                {CardComponent}
              </Badge.Ribbon>
            ) : (
              CardComponent
            )}
          </Col>
        )
      })}
    </Row>
  )
}
export default PastTest
