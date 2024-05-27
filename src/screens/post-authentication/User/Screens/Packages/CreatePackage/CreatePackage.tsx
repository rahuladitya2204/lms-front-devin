import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Tag,
  message,
} from "@Lib/index";
import { Enum, Types, Utils } from "@adewaskar/lms-common";
import React, { Fragment, ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "@Router/index";

import BackButton from "@Components/BackButton";

import Header from "@Components/Header";
import PackageDetails from "./PackageDetails/PackageDetails";
import PackageLandingPageEditor from "./PackageLandingPage/PackageLandingPageEditor";
import PackagePlan from "./PackagePricing";
import PackagePricing from "./PackagePricing";
import Products from "./PackageDetails/Products/Products";
import Tabs from "@Components/Tabs";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import PackageUsers from "./PackageLearners";
import PackageLearners from "./PackageLearners";
import SEOComponent from "@Components/SEOComponent";
import CreateFaqs from "@Components/CreateFaqsComponent";

const { confirm } = Modal;
interface CreatePackageComponentPropsI {
  // data: Types.Package;
  children?: ReactNode;
  closeModal?: Function;
  onSuccess?: () => void;
  onFinish?: (data: Types.Package) => void;
}

const CreatePackage: React.FC<CreatePackageComponentPropsI> = (props) => {
  const { packageId } = useParams();
  const { data: bundle } = User.Queries.useGetPackageDetails(packageId + "");
  return (
    <Card>
      <Row gutter={[20, 30]}>
        <Col span={24}>
          <>
            <Tabs
              destroyInactiveTabPane={false}
              tabKey="create-package"
              items={[
                {
                  label: "Details",
                  key: "details",
                  children: <PackageDetails packageId={packageId + ""} />,
                },
                {
                  label: "Products",
                  key: "products",
                  children: <Products category={bundle.category} />,
                },
                {
                  label: "Landing Page",
                  key: "landing-page",
                  children: (
                    <PackageLandingPageEditor packageId={packageId + ""} />
                  ),
                },
                {
                  label: "FAQs",
                  key: "faqs",
                  children: <CreateFaqs name={["faqs"]} />,
                },
                {
                  label: "SEO",
                  key: "seo",
                  children: <SEOComponent name={["seo"]} />,
                },
                {
                  label: "Pricing",
                  key: "pricing",
                  children: <PackagePricing packageId={packageId + ""} />,
                },
              ]}
            />
          </>
        </Col>
      </Row>
    </Card>
  );
};

export default function PackageInformationEditor() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!packageId;
  const { mutate: publishPackage, isLoading: publishingPackage } =
    User.Queries.usePublishPackage();
  const { mutate: unpublishPackage, isLoading: unpublishingPackage } =
    User.Queries.useUnpublishPackage();
  const { data: packageDetails, isLoading: loadingPackage } =
    User.Queries.useGetPackageDetails(packageId + "", {
      enabled: !!packageId,
    });
  useEffect(() => {
    console.log(packageDetails, "packageDetailspackageDetails");
    form.setFieldsValue(packageDetails);
  }, [packageDetails]);

  const [form] = Form.useForm<Types.Package>();

  const onSubmit = (e: Types.Package) => {
    const data = {
      ...e,
    };
    if (isEdit) {
      updatePackage(
        { id: packageId + "", data: data },
        {
          onSuccess: () => {
            message.open({
              type: "success",
              content: "Package updated",
            });
          },
        }
      );
    } else {
      // @ts-ignore
      createPackage(
        { data: data },
        {
          onSuccess: () => {
            //  navigate('../');
            message.open({
              type: "success",
              content: "Package Created",
            });
            // props.onSuccess && props.onSuccess();
            // props.closeModal && props.closeModal();
          },
        }
      );
    }
  };
  const plan = packageDetails.plan as unknown as Types.Plan;
  const isPackageValid = Utils.validatePublishPackage(packageDetails);
  const { mutate: createPackage, isLoading: createPackageLoading } =
    User.Queries.useCreatePackage();
  const { mutate: updatePackage, isLoading: updatePackageLoading } =
    User.Queries.useUpdatePackage();
  const PublishPackage = (
    <Button
      loading={publishingPackage}
      key="submit"
      type="primary"
      disabled={!isPackageValid}
      onClick={() => {
        confirm({
          title: "Are you sure?",
          content: `You want to publish this package?`,
          onOk() {
            publishPackage({
              packageId: packageId + "",
            });
          },
          okText: "Yes, Publish",
        });
      }}
    >
      Publish Package
    </Button>
  );
  const UnpublishPackage = (
    <Button
      style={{ marginRight: 10 }}
      onClick={() => {
        confirm({
          title: "Are you sure?",
          content: `You want to unpublish this package? Will be moved to Draft`,
          onOk() {
            unpublishPackage({
              packageId: packageId + "",
            });
          },
          okText: "Yes, Publish",
        });
      }}
    >
      Revert to Draft
    </Button>
  );
  const SavePackage = (
    <Button
      style={{ marginLeft: 10 }}
      loading={createPackageLoading || updatePackageLoading}
      key="submit"
      type="primary"
      onClick={form.submit}
    >
      Save Details
    </Button>
  );
  return (
    <Header
      onBack={() => navigate("../")}
      title={
        <span>
          <BackButton
            disabled={!packageDetails.category}
            onClick={() => navigate(`/admin/products/packages`)}
          />{" "}
          {packageDetails._id ? packageDetails.title : "Create Package"}
          {packageDetails.status !== Enum.PackageStatus.PUBLISHED
            ? PublishPackage
            : null}
        </span>
      }
      extra={[
        ...(packageDetails.status === Enum.PackageStatus.PUBLISHED
          ? [UnpublishPackage, <Tag color="green">Published</Tag>]
          : []),
        // ((packageDetails.status !== Enum.PackageStatus.PUBLISHED))?PublishPackage:null,
        SavePackage,
      ]}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Tabs
          destroyInactiveTabPane={false}
          tabPosition="left"
          items={[
            { label: "Information", key: "info", children: <CreatePackage /> },
            {
              label: "Learners",
              key: "learners",
              children: <PackageLearners packageId={packageId + ""} />,
            },
          ]}
        />
      </Form>
    </Header>
  );
}
