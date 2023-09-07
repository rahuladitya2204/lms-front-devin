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

import ActionModal from '@Components/ActionModal'
import CreateTest from '../CreateTest'
import { Fragment } from 'react'
import TestCard from './TestCard'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

const { Text } = Typography

function TestsList(props: { filter: Types.GetTestsFilter }) {
  const SkeletonArr = [1, 1, 1, 1, 1, 1, 1, 1]
  const { data, isLoading: loading } = User.Queries.useGetTests(
    // props.filter
    props.filter
  )
  return (
    <Fragment>
      <Fragment>
        {loading ? (
          <Row gutter={[20, 100]}>
            {SkeletonArr.map(() => (
              <Col span={6}>
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
                </Card>{' '}
              </Col>
            ))}
          </Row>
        ) : (
          <List
            grid={{ gutter: 20, column: 4 }}
            size="large"
            // pagination={{
            //   onChange: (page) => {
            //     console.log(page);
            //   },
            //   pageSize: 3,
            // }}
            dataSource={data}
            renderItem={test => (
              <div style={{ padding: 30 }}>
                <TestCard test={test} />
              </div>
            )}
          />
        )}
      </Fragment>
    </Fragment>
  )
}
export default TestsList
