import { Avatar, Button, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import ActionModal from "@Components/ActionModal/ActionModal";
import Container from "@Components/Container";
import CreateCategory from "./CreateCategory";
import Header from "@User/Screens/UserRoot/UserHeader";
import Image from "@Components/Image";
import { Link } from "@Router/index";
import MoreButton from "@Components/MoreButton";
import { Types } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import { useModal } from "@Components/ActionModal/ModalContext";

function CategoriesScreen() {
  const { data, isFetching: loading } =
    User.Queries.useGetProductCategories("all");
  const { mutate: deleteCategory } = User.Queries.useDeleteProductCategory();
  const { openModal } = useModal();

  return (
    <Header
      title={"Categories"}
      extra={[
        <Button
          onClick={() => {
            openModal(<CreateCategory />, {
              title: "Create Category",
            });
          }}
          type="primary"
        >
          Create New Category
        </Button>,
        // <ActionModal
        //   title="Create Category"
        //   cta={<Button type="primary">Create New Category</Button>}
        // >
        //   <CreateCategory />
        // </ActionModal>
      ]}
    >
      <Container>
        <Table searchFields={["title", 'slug']} dataSource={data} loading={loading}>
          <TableColumn
            title="Thumbnail Image"
            render={(_: any, record: Types.ProductCategory, index: number) => (
              <Avatar size={60} src={record.thumbnailImage} />
            )}
          />
          <TableColumn
            title="Name"
            dataIndex="title"
            key="title"
            render={(_: any, record: Types.ProductCategory, index: number) => (
              <Link to={`${record._id}/editor`}>{record.title}</Link>
            )}
          />
          <TableColumn
            title="Description"
            dataIndex="description"
            key="description"
          />
          {/* <TableColumn
            title="Total Courses"
            dataIndex="totalCourses"
            key="totalCourses"
            render={(_: any, record: Types.ProductCategory) => (
              <Space size="middle">{record.products.length}</Space>
            )}
          /> */}
          <TableColumn
            title="Action"
            key="action"
            render={(_: any, record: Types.ProductCategory, index: number) => (
              <MoreButton
                items={[
                  {
                    label: "Edit Category",
                    onClick: () =>
                      window.open(
                        `/admin/products/product-category/${record._id}/editor`
                      ),
                    key: "edit",
                    // icon: <EditOutlined />,
                    // onClick: () => navigate(`${record._id}/edit`)
                  },
                  {
                    label: "Delete ",
                    onClick: () => {
                      deleteCategory({ id: record._id });
                      //   window.open(`users/${record._id}/editor`, '_blank')
                    },
                    key: "delete",
                    icon: <DeleteOutlined />,
                  },
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
  );
}

export default CategoriesScreen;
