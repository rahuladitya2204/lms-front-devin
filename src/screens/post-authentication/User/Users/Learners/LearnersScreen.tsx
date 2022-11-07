import { Button, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import AddLearner from './AddLearners'
import { Fragment } from 'react'
import Header from '../../Dashboard/Header/Header'
import { Learner } from '../../../../../types/Learner.types'
import { useGetLearners } from '../../../../../network/Learner/queries'

function LearnersScreen() {
  const { data, isLoading: loading } = useGetLearners()

  return (
    <Fragment>
      <Header
        title="Learners"
        extra={[
          <AddLearner>
            {' '}
            <Button type="primary">Add Learner</Button>
          </AddLearner>
        ]}
      />

      <Row>
        <Col span={24}>
          <Table dataSource={data} loading={loading}>
            <Table.Column title="Name" dataIndex="name" key="name" />
            <Table.Column title="Email Adress" dataIndex="email" key="email" />

            <Table.Column
              title="Last Login"
              dataIndex="lastActive"
              key="lastActive"
            />
            <Table.Column
              title="Joined On"
              dataIndex="createdAt"
              key="createdAt"
            />
            <Table.Column
              title="Action"
              key="action"
              render={(_: any, record: Learner) => (
                <Space size="middle">
                  <EditOutlined
                    onClick={() =>
                      window.open(`learners/${record._id}/editor`, '_blank')
                    }
                  />
                  <DeleteOutlined />
                </Space>
              )}
            />
          </Table>;
        </Col>
      </Row>
    </Fragment>
  )
}

export default LearnersScreen
