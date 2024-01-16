import {
  Badge,
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
  Tag
} from 'antd'
import { Constants, Enum, Types } from '@adewaskar/lms-common'

import { Fragment } from 'react'
import TestCard from './TestCard'
import { Typography } from '@Components/Typography'
import { User } from '@adewaskar/lms-common'

const { Text } = Typography

function TestsList(props: { filter: Types.GetTestsFilter }) {
  const SkeletonArr = [1, 1, 1, 1, 1, 1, 1, 1].map(
    () => Constants.INITIAL_TEST_DETAILS
  )
  const { data, isFetching: loading } = User.Queries.useGetTests(
    // props.filter
    props.filter
    // {
    //   // @ts-ignore
    //   enabled: !!props.filter.category
    // }
  )
  // const filteredData=data.filter(pd => {
  //   return !pd.endedAt;
  // })
  return (
    <Fragment>
      <Fragment>
        <List
          grid={{ gutter: 20, column: 4, xs: 1, sm: 2, md: 3 }}
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
          renderItem={test => {
            const TestCardComponent = <TestCard test={test} />
            return (
              <div style={{ padding: 30 }}>
                {loading ? (
                  <SkeletonCard />
                ) : test.status === Enum.TestStatus.PUBLISHED ? (
                  <Badge.Ribbon text="Published" color="orange">
                    {TestCardComponent}
                  </Badge.Ribbon>
                ) : (
                  TestCardComponent
                )}
              </div>
            )
          }}
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
