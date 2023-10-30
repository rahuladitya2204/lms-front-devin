import { Button, Space, Table } from 'antd'
import Container from '@Components/Container'
import Header from '@User/Screens/UserRoot/UserHeader'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'
import MoreButton from '@Components/MoreButton'
import { EditOutlined } from '@ant-design/icons'

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
          <Table.Column title="Package Name" dataIndex="title" key="title" />
          <Table.Column
            title="Total Courses"
            dataIndex="totalCourses"
            key="totalCourses"
            render={(_: any, record: Types.Package) => (
              <Space size="middle">{record.products.length}</Space>
            )}
          />
          <Table.Column
            title="Action"
            key="action"
            render={(_: any, record: Types.Package, index: number) => (
              <MoreButton
                items={[
                  {
                    label: 'Edit',
                    key: 'edit',
                    icon: <EditOutlined />,
                    onClick: () => navigate(`${record._id}/edit`)
                  }
                  // {
                  //   label: 'Delete ',
                  //   onClick: () => {
                  //     deleteItem(index)
                  //     //   window.open(`instructors/${record._id}/editor`, '_blank')
                  //   },
                  //   key: 'edit',
                  //   icon: <DeleteOutlined />
                  // }
                ]}
              />
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
