import { Button, Space, Table } from 'antd'
import Container from '@Components/Container'
import Header from '@User/Screens/UserRoot/UserHeader'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

function PackagesScreen() {
  const { data, isLoading: loading } = User.Queries.useGetPackages()
  const navigate = useNavigate()
  return (
    <Header
      title={'Packages'}
      extra={[
        <Button onClick={() => navigate(`create`)} type="primary">
          Create New Package
        </Button>
      ]}
    >
      <Container>
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
                {/* <ActionModal cta={<EditOutlined />}>
                  <CreatePackage data={record} />
                </ActionModal>
                <DeleteOutlined /> */}
              </Space>
            )}
          />
        </Table>
      </Container>
      {/* <Card
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
           
          </Col>
        </Row>
      </Card> */}
    </Header>
  )
}

export default PackagesScreen
