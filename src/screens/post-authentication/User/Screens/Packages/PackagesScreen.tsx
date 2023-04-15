import { Button, Card, Col, Row, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddPackage from './CreatePackage'
import CreatePackage from './CreatePackage'
import Header from '@Components/Header'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const { Text } = Typography

function PackagesScreen() {
  const { data, isLoading: loading } = User.Queries.useGetPackages()

  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Packages'}
        extra={
          <ActionModal cta={<Button type="primary">Create New Package</Button>}>
            <AddPackage> </AddPackage>
          </ActionModal>
        }
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Package Name" dataIndex="name" key="name" />
              <Table.Column
                title="Total Courses"
                dataIndex="totalCourses"
                key="totalCourses"
                render={(_: any, record: Types.Package) => (
                  <Space size="middle">{record.courses.length}</Space>
                )}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Package) => (
                  <Space size="middle">
                    <ActionModal cta={<EditOutlined />}>
                      <CreatePackage data={record} />
                    </ActionModal>
                    <DeleteOutlined />
                  </Space>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  )
}

export default PackagesScreen
