import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Row,
  Skeleton,
  Spin,
  Tag,
  message,
} from "antd";
import { Constants, Enum, Types, Utils } from "@adewaskar/lms-common";
import {
  ExportOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  MenuOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@Router/index";

import ActionDrawer from "@Components/ActionDrawer";
import BackButton from "@Components/BackButton";
import ProductCategoryInformationEditor from "./ProductCategoryInformation";
import Tabs from "@Components/Tabs";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";

const { confirm } = Modal;

function ProductCategoryEditor() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const productCategoryId = id + "";

  const { mutate: updateProductCategoryApi, isLoading: updatingCategory } =
    User.Queries.useUpdateProductCategory();

  const { data: productCategoryDetails, isFetching: loadingProductCategory } =
    User.Queries.useGetProductCategoryDetails(productCategoryId, {
      enabled: !!productCategoryId,
    });

  useEffect(() => {
    const i = { ...productCategoryDetails };
    // @ts-ignore
    i.info.updates = i.info.updates.map((ii) => {
      return {
        ...ii,
        date: dayjs(ii.date),
      };
    });
    form.setFieldsValue(i);
  }, [productCategoryDetails, form]);

  const updateProductCategory = (e: Types.ProductCategory) => {
    updateProductCategoryApi(
      {
        id: productCategoryId,
        data: {
          ...productCategoryDetails,
          ...e,
          info: {
            ...productCategoryDetails.info,
            ...e.info,
          },
        },
      },
      {
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Saved",
          });
        },
      }
    );
  };

  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const MainNavTabs = (
    // <Tabs
    //   destroyInactiveTabPane={false}
    //   navigateWithHash
    //   tabPosition={"left"}
    //   style={{ minHeight: "100vh" }}
    //   items={[
    //     {
    //       label: (
    //         <span>
    //           <InfoCircleOutlined />
    //           Information
    //         </span>
    //       ),
    //       key: "information",
    //       children: <ProductCategoryInformationEditor />,
    //     },
    //     // {
    //     //   label: (
    //     //     <span>
    //     //       <ToolOutlined />Builder
    //     //     </span>
    //     //   ),
    //     //   key: 'builder'
    //     // },
    //     // {
    //     //   label: (
    //     //     <span>
    //     //       <UserOutlined />Learners
    //     //     </span>
    //     //   ),
    //     //   key: 'learners',
    //     //   children: (
    //     //     <ProductCategoryLearners
    //     //       productCategoryId={productCategory._id + ''}
    //     //     />
    //     //   )
    //     // },
    //     {
    //       label: (
    //         <span>
    //           <SafetyCertificateOutlined />
    //           Certificate
    //         </span>
    //       ),
    //       key: "certificate",
    //       children: null,
    //       //   (
    //       //   <ProductCategoryCertificate
    //       //     productCategoryId={productCategory._id}
    //       //     productCategory={productCategory}
    //       //     saveProductCategory={saveProductCategory}
    //       //   />
    //       // )
    //     },
    //   ]}
    // />
    <ProductCategoryInformationEditor />
  );
  return (
    <Spin spinning={false}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card
            title={
              <span>
                <BackButton
                  // disabled={!test.category}
                  onClick={() => navigate(`/admin/products/category`)}
                />{" "}
                Edit Category
              </span>
            }
            extra={[
              // <Button
              //   disabled={!productCategory._id}
              //   icon={<ExportOutlined />}
              //   onClick={() => {
              //     window.open(
              //       `/admin/products/productCategory/${
              //         productCategory._id
              //       }/builder`
              //     )
              //   }}
              //   style={{ marginRight: 10 }}
              // >
              //   Go to ProductCategory Builder
              // </Button>,
              <Button
                // disabled={!validateDraftProductCategory()}
                loading={updatingCategory}
                type="primary"
                onClick={form.submit}
                icon={<SaveOutlined />}
              >
                Save
              </Button>,
              //   isMobile?<ActionDrawer cta={<Button icon={<MenuOutlined/>}></Button>}>
              //   {MainNavTabs}
              // </ActionDrawer>:null
            ]}
          >
            <Form
              initialValues={productCategoryDetails}
              onFinish={updateProductCategory}
              layout="vertical"
              form={form}
            >
              {MainNavTabs}
            </Form>
          </Card>
        </Col>
        {/* <Col span={20}>
          <ProductCategoryInformationEditor />
        </Col> */}
      </Row>
    </Spin>
  );
}

export default ProductCategoryEditor;
