import {
  Button,
  Card,
  Col,
  Empty,
  List,
  Row,
  Skeleton,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { Fragment } from 'react'
import TestCard from './TestCard'
import { User } from '@adewaskar/lms-common'

const { Text } = Typography

function TestsList(props: { filter: Types.GetTestsFilter }) {
  const SkeletonArr = [1, 1, 1, 1, 1, 1, 1, 1].map(
    () => Constants.INITIAL_LIVE_TEST_DETAILS
  )
  const { data, isLoading: loading } = User.Queries.useGetTests(
    // props.filter
    props.filter
  )
  // const filteredData=data.filter(pd => {
  //   return !pd.endedAt;
  // })
  return (
    <Fragment>
      <Fragment>
        <List
          grid={{ gutter: 20, column: 4 }}
          size="large"
          // pagination={{
          //   onChange: (page) => {
          //     console.log(page);
          //   },
          //   pageSize: 3,
          // }}
          dataSource={
            loading
              ? SkeletonArr
              : data.filter(test => props.filter.status.includes(test.status))
          }
          renderItem={test => (
            <div style={{ padding: 30 }}>
              {loading ? <SkeletonCard /> : <TestCard test={test} />}
            </div>
          )}
        />
      </Fragment>
    </Fragment>
  )
}
export default TestsList

const SkeletonCard = () => (
  <Card>
    <Skeleton active paragraph />
    <Row justify={'space-between'}>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
    </Row>{' '}
  </Card>
)
