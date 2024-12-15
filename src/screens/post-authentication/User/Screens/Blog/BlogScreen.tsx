import {
  BarChartOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Space, Table } from "antd";

import Container from "@Components/Container";
import Header from "@User/Screens/UserRoot/UserHeader";

import BlogStatusTag from "./BlogStatusTag";
import { Types } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import { useNavigate } from "@Router/index";

function BlogsScreen() {
  const { data, isFetching: loading } = User.Queries.useGetBlogs();
  const navigate = useNavigate();
  return (
    <Header
      title={"Blogs"}
      extra={[
        <Button onClick={() => navigate(`create`)} type="primary">
          Create New Blog
        </Button>,
      ]}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table loading={loading} dataSource={data}>
            <Table.Column
              title="Title"
              dataIndex="title"
              key="title"
              render={(_: any, blog: Types.Blog) => (
                <Button
                  onClick={() => navigate(`${blog._id}/edit`)}
                  type="link"
                  size="small"
                >
                  {blog.title}
                </Button>
              )}
            />
            <Table.Column
              title="Analysis"
              dataIndex="analysis"
              key="analysis"
              render={(_: any, blog: Types.Blog) => (
                <Button
                  icon={<BarChartOutlined />}
                  size="small"
                  type="primary"
                  onClick={() => navigate(`${blog._id}/status`)}
                >
                  Show Analysis
                </Button>
              )}
            />
            {/* <Table.Column
                title="Questions"
                dataIndex="status"
                key="status"
                render={(_: any, blog: Types.Blog) =>
                  blog.sections.map(i => i.items).flat().length
                }
              /> */}
            <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              // @ts-ignore
              render={(_: any, blog: Types.Blog) => (
                // @ts-ignore
                <BlogStatusTag blog={blog} />
              )}
            />

            <Table.Column
              title="Enrolled"
              dataIndex="enrolled"
              key="enrolled"
              render={(_: any, blog: Types.Blog) =>
                blog.analytics.enrolled.count
              }
            />
            {/* <Table.Column
                title="Duration"
                dataIndex="duration"
                key="duration"
                render={(_: any, blog: Types.Blog) =>
                  blog.duration.enabled ? blog.duration.value + ' mins' : '-'
                }
              /> */}
            {/* <Table.Column
                title="Action"
                key="action"
                render={(_: any, blog: Types.Blog, index: number) => (
                  <MoreButton
                    items={[
                      {
                        label: 'Open Test Builder',
                        key: 'blog-builder',
                        icon: <SettingOutlined />,
                        onClick: () => {
                          window.open(
                            `/admin/products/blog/${blog._id}/builder`
                          )
                        }
                      }
                    ]}
                  />
                )}
              /> */}
          </Table>
        </Col>
      </Row>
      {/* <Card
          bodyStyle={{ padding: 0 }}
          title={'Blogs'}
          extra={
            <ActionModal cta={<Button type="primary">Create New Blog</Button>}>
              <AddBlog> </AddBlog>
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

export default BlogsScreen;
