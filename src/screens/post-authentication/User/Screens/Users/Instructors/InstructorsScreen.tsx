import { Button, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import AddInstructor from './AddInstructor'
import { Fragment } from 'react'
import Header from '../../Header/Header'
import { Instructor } from '@Types/Instructor.types'
import { useGetInstructors } from '../../../Api/queries'

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
              title="Designation"
              dataIndex="designation"
              key="designation"
            />
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
              render={(_: any, record: Instructor) => (
                <Space size="middle">
                  <EditOutlined onClick={() => window.open(`instructors/${record._id}/editor`, '_blank')} />
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
