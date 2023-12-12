import {
  Avatar,
  Badge,
  Card,
  Col,
  List,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography
} from 'antd'
import { CalendarOutlined, EditOutlined } from '@ant-design/icons'
import { Enum, Learner, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import NoItemFound from '@Components/NoItemFound'
import SkeletonImage from '@Components/SkeletonImage'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Meta } = Card
const { Text } = Typography

function PastTest(props: { filter: Types.GetTestsFilter }) {
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
      <Row gutter={[20, 30]}>
        {SkeletonArr.map(() => (
          <Col xs={24} sm={12} md={8} lg={6}>
            <SkeletonTestCard />
          </Col>
        ))}
      </Row>
    )
  }
  return (
    <Row gutter={[30, 30]}>
      {pastTests.map(({ product: { data: test }, metadata }) => {
        // @ts-ignore
        const CardComponent = <TestCard metadata={metadata} test={test} />
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

export const SkeletonTestCard = () => {
  return (
    <Card>
      <SkeletonImage
        style={{ flex: 1, height: 200, marginBottom: 20 }}
        active
      />
      <Skeleton avatar active paragraph={{ rows: 1 }} />
    </Card>
  )
}

const TestCard = ({ test, metadata }: { test: Types.Test, metadata: any }) => {
  const navigate = useNavigate()
  const testStartDate = metadata.test.startedAt || test?.live?.startedAt
  const {
    data: { test: testResult, status, metrics: { learnerScore, passingScore } },
    isFetching: loadingResult
  } = Learner.Queries.useGetTestResult(test._id + '')
  return (
    <Card
      // bodyStyle={{ padding: 10 }}
      hoverable
      onClick={() => {
        navigate(test?._id + '')
      }}
      cover={<Image height={200} alt="example" src={test?.thumbnailImage} />}
    >
      <Meta
        title={test.title}
        description={
          <Space>
            {test.status === Enum.TestStatus.PUBLISHED ? (
              learnerScore >= passingScore ? (
                <Tag color="green-inverse">Passed</Tag>
              ) : (
                <Tag color="red-inverse">Failed</Tag>
              )
            ) : test.status === Enum.TestStatus.IN_PROGRESS ? (
              <Tag color="orange-inverse">Evaluation in progres</Tag>
            ) : null}
            <Tag>Taken on: {dayjs(testStartDate).format('LL')}</Tag>
          </Space>
        }
        avatar={<EditOutlined />}
      />
    </Card>
  )
}
