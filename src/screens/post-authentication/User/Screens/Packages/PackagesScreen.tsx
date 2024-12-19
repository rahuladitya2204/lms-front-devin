import {
  BarChartOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import slugify from "slugify";
import Container from "@Components/Container";
import Header from "@User/Screens/UserRoot/UserHeader";
import MoreButton from "@Components/MoreButton";
import PackageCard from "./CreatePackage/PackageCard";
import PackageStatusTag from "./PackageStatusTag";
import { Types } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import { useNavigate } from "@Router/index";
import { useModal } from "@Components/ActionModal/ModalContext";
import { ReactNode } from "react";

function PackagesScreen() {
  const { data, isFetching: loading } = User.Queries.useGetPackages();
  const navigate = useNavigate();
  const { openModal } = useModal();
  return (
    <Header
      title={"Packages"}
      extra={[
        <Button onClick={() => openModal(<CreatePackage />)} type="primary">
          Create New Package
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
              render={(_: any, bundle: Types.Package) => (
                <Button
                  onClick={() =>
                    navigate(`/admin/products/package/${bundle._id}/editor`)
                  }
                  type="link"
                  size="small"
                >
                  {bundle.title}
                </Button>
              )}
            />
            <Table.Column
              title="Package Type"
              dataIndex="type"
              key="type"
            // render={(_: any, bundle: Types.Package) => bundle.slug || "-"}
            />
            <Table.Column
              title="URL Slug"
              dataIndex="slug"
              key="slug"
              render={(_: any, bundle: Types.Package) => bundle.slug || "-"}
            />
            <Table.Column
              title="Promoted"
              dataIndex="slug"
              key="slug"
              render={(_: any, bundle: Types.Package) =>
                bundle?.promotion?.enabled ? (
                  <Tag color="purple">Promoted</Tag>
                ) : (
                  "-"
                )
              }
            />
            {/* <Table.Column
              title="Questions"
              dataIndex="status"
              key="status"
              render={(_: any, bundle: Types.Package) =>
                bundle.sections.map(i => i.items).flat().length
              }
            /> */}
            <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              // @ts-ignore
              render={(_: any, bundle: Types.Package) => (
                // @ts-ignore
                <PackageStatusTag bundle={bundle} />
              )}
            />

            <Table.Column
              title="Enrolled"
              dataIndex="enrolled"
              key="enrolled"
              render={(_: any, bundle: Types.Package) =>
                bundle.analytics.enrolled.count
              }
            />
            {/* <Table.Column
              title="Duration"
              dataIndex="duration"
              key="duration"
              render={(_: any, bundle: Types.Package) =>
                bundle.duration.enabled ? bundle.duration.value + ' mins' : '-'
              }
            /> */}
            {/* <Table.Column
              title="Action"
              key="action"
              render={(_: any, bundle: Types.Package, index: number) => (
                <MoreButton
                  items={[
                    {
                      label: 'Open Test Builder',
                      key: 'bundle-builder',
                      icon: <SettingOutlined />,
                      onClick: () => {
                        window.open(
                          `/admin/products/bundle/${bundle._id}/builder`
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
  );
}

export default PackagesScreen;

interface CreatePackagePropsI {
  children?: ReactNode;
  closeModal?: any;
}

const CreatePackage: React.FC<CreatePackagePropsI> = (props) => {
  const navigate = useNavigate();
  const { mutate: createPackage, isLoading: loading } =
    User.Queries.useCreatePackage();
  const [form] = Form.useForm();

  const onSubmit = (e: Types.Package) => {
    console.log("Helo", e);
    e.slug = slugify(e.title);
    createPackage(
      {
        data: e,
      },
      {
        onSuccess: (bundle) => {
          console.log(bundle, "here it is");
          // @ts-ignore
          navigate(`/admin/products/package/${bundle._id}/editor`);
          message.open({
            type: "success",
            content: "Have fun creating a Package!",
          });
          props.closeModal && props.closeModal();
        },
      }
    );
  };
  // const { listItems: users } = User.Queries.useGetUsers()
  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        required
        tooltip="Title of your Package"
        rules={[
          { required: true, message: "Please mention title for Package" },
        ]}
      >
        <Input placeholder="Enter your package title" />
      </Form.Item>
      <Button
        loading={loading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  );
};
