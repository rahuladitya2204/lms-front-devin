import { Button, Card, Col, Form, Row, Spin } from "@Lib/index";
import { Constants, Types } from "@adewaskar/lms-common";
import { EyeOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Fragment, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useParams } from "@Router/index";

import Header from "@Components/Header";
import ProductCategoryDetailsEditor from "./ProductCategoryDetailsEditor/ProductCategoryDetails";
import ProductCategoryLandingPage from "./ProductCategoryLandingPage";
import ProductCategoryLinks from "./ProductCategoryLinks";
import ProductCategoryNotifications from "./ProductCategoryNotifications";
import Tabs from "@Components/Tabs";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import ProductCategoryEXAMs from "./ProductCategoryExams";
import FAQsComponent from "@Components/FAQsComponent";

function ProductCategoryInformationEditor(props: any) {
  const { id } = useParams();
  const testId = id + "";
  const [test, setProductCategory] = useState(Constants.INITIAL_TEST_DETAILS);

  const { data: testDetails, isFetching: loadingProductCategory } =
    User.Queries.useGetProductCategoryDetails(testId, {
      enabled: !!testId,
    });

  const form = Form.useForm();
  return (
    <Spin spinning={loadingProductCategory}>
      <Tabs
        // navigateWithHash
        destroyInactiveTabPane={false}
        items={[
          {
            label: `Details`,
            active: true,
            key: "details",
            children: (
              <ProductCategoryDetailsEditor
                saveProductCategory={props.saveProductCategory}
                productCategory={props.test}
                testId={props.testId}
              />
            ),
          },
          {
            label: `Landing Page`,
            key: "landing-page",
            children: <ProductCategoryLandingPage />,
          },
          {
            label: `Exams`,
            key: "exams",
            children: <ProductCategoryEXAMs />,
          },
          {
            label: `FAQs`,
            key: "faqs",
            children: <FAQsComponent name={["info", "faqs"]} />,
          },
          {
            label: `Notifications`,
            key: "notifs",
            children: <ProductCategoryNotifications />,
          },
          {
            label: `Important Links`,
            key: "links",
            children: <ProductCategoryLinks />,
          },
          // {
          //   label: `Advanced`,
          //   key: 'advanced',
          //   children: (
          //     <ProductCategoryAdvancedSettings
          //       saveProductCategory={props.saveProductCategory}
          //       test={props.test}
          //       testId={props.testId}
          //     />
          //   )
          // }
        ]}
      />

      <Outlet />
    </Spin>
  );
}

export default ProductCategoryInformationEditor;
