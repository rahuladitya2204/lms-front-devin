import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  List,
  Row,
  Tag,
  Typography
} from 'antd'
import { CalendarOutlined, EditOutlined } from '@ant-design/icons'
import { Learner, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Meta } = Card
const { Text } = Typography

function PastTest(props: { filter: Types.GetTestsFilter }) {
  const navigate = useNavigate()
  const {
    data,
    isFetching: loading
  } = Learner.Queries.useGetEnrolledProductList('test')
  console.log(data, 'tests')
  return (
    <Row gutter={[20, 30]}>
      {data
        .filter(pd => {
          return pd.product?.data?.endedAt || pd.metadata.test.endedAt
        })
        .map(({ product: { data: test }, metadata }) => {
          const testStartDate = metadata.test.startedAt || test?.startedAt
          const testEndDate = metadata.test.endedAt || test?.endedAt
          const isTestAttempted =
            metadata.test.startedAt && metadata.test.endedAt
          const CardComponent = (
            <Card
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
              {test?.isLive ? (
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
