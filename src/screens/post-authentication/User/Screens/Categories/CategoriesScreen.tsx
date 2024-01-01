import { Avatar, Button, Space, Table } from 'antd'

import ActionModal from '@Components/ActionModal/ActionModal'
import Container from '@Components/Container'
import CreateCategory from './CreateCategory'
import { EditOutlined } from '@ant-design/icons'
import Header from '@User/Screens/UserRoot/UserHeader'
import Image from '@Components/Image'
import MoreButton from '@Components/MoreButton'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { useModal } from '@Components/ActionModal/ModalContext'

function CategoriesScreen() {
  const { data, isFetching: loading } = User.Queries.useGetProductCategories(
    'all'
  )
  const { openModal } = useModal()

  return (
    <Header
      title={'Categories'}
      extra={[
        <Button
          onClick={() => {
            openModal(<CreateCategory />, {
              title: 'Create Category'
            })
          }}
          type="primary"
        >
          Create New Category
        </Button>
        // <ActionModal
        //   title="Create Category"
        //   cta={<Button type="primary">Create New Category</Button>}
        // >
        //   <CreateCategory />
        // </ActionModal>
      ]}
    >
      <Container>
        <Table dataSource={data} loading={loading}>
          <Table.Column
            title="Thumbnail Image"
            render={(_: any, record: Types.ProductCategory, index: number) => (
              <Avatar size={60} src={record.thumbnailImage} />
            )}
          />
          <Table.Column title="Name" dataIndex="title" key="title" />
          <Table.Column
            title="Description"
            dataIndex="description"
            key="description"
          />
          {/* <Table.Column
            title="Total Courses"
            dataIndex="totalCourses"
            key="totalCourses"
            render={(_: any, record: Types.ProductCategory) => (
              <Space size="middle">{record.products.length}</Space>
            )}
          /> */}
          <Table.Column
            title="Action"
            key="action"
            render={(_: any, record: Types.ProductCategory, index: number) => (
              <MoreButton
                items={[
                  {
                    label: (
                      <Button
                        type="text"
                        onClick={() =>
                          openModal(<CreateCategory data={record} />, {
                            title: 'Edit Category'
                          })
                        }
                      >
                        Edit Category
                      </Button>
                    ),
                    key: 'edit'
                    // icon: <EditOutlined />,
                    // onClick: () => navigate(`${record._id}/edit`)
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
        title={'Categories'}
        extra={
          <ActionModal cta={<Button type="primary">Create New Category</Button>}>
            <AddCategory> </AddCategory>
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

export default CategoriesScreen
