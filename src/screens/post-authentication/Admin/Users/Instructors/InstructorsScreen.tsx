import { Button, Col, Row, Space, Table } from 'antd'

import AddInstructor from './AddInstructor'
import { DeleteOutlined } from '@ant-design/icons'
import { Fragment } from 'react'
import Header from '../../../Common/Dashboard/Header/Header'
import { InstructorDetailsType } from '../../../../../types/Instructor.types'
import { useGetInstructors } from '../../../../../queries/Instructor/queries'

function InstructorsScreen() {
  const { data, isLoading: loading } = useGetInstructors()

  return (
    <Fragment>
      <Header
        title="Instructors"
        extra={[
          <AddInstructor>
            {' '}
            <Button type="primary">Add Instructor</Button>
          </AddInstructor>
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
            <Table.Column title="Courses" dataIndex="courses" key="courses" />
            <Table.Column title="Rating" dataIndex="rating" key="rating" />
            <Table.Column
              title="Joined On"
              dataIndex="createdAt"
              key="createdAt"
            />
            <Table.Column
              title="Action"
              key="action"
              render={(_: any, record: InstructorDetailsType) => (
                <Space size="middle">
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

export default InstructorsScreen
