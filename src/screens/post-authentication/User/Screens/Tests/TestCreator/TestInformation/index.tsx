import { Button, Card, Col, Form, Row, Spin } from "@Lib/index";
import { Constants, Types } from "@adewaskar/lms-common";
import { EyeOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Fragment, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useParams } from "@Router/index";
import * as React from "react";

import Tabs from "@Components/Tabs";
import TestDetailsEditor from "./TestDetailsEditor/TestDetails";
import TestLandingPageEditor from "./TestLandingPage/TestLandingPageEditor";
import TestPricingEditor from "../TestPricingEditor/TestPricingEditor";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import CreateFaqs from "@Components/CreateFaqsComponent";
import SEOComponent from "@Components/SEOComponent";

const TestInformationEditor = (props: any) => {
  const { id } = useParams();
  const testId = id + "";
  const [test, setTest] = useState(Constants.INITIAL_TEST_DETAILS);

  const { data: testDetails, isFetching: loadingTest } =
    User.Queries.useGetTestDetails(testId, {
      enabled: !!testId,
    });

  useEffect(() => {
    setTest(testDetails);
  }, [testDetails]);
  return (
    <Spin spinning={loadingTest}>
      <Tabs
        navigateWithHash
        items={[
          {
            label: `Details`,
            active: true,
            key: "details",
            children: (
              <TestDetailsEditor
                saveTest={props.saveTest}
                test={props.test}
                testId={props.testId}
              />
            ),
          },
          {
            label: `Landing Page`,
            key: "landing-page",
            children: (
              <TestLandingPageEditor
                saveTest={props.saveTest}
                test={props.test}
                testId={props.testId}
              />
            ),
          },
          {
            label: `FAQs`,
            key: "faqs",
            children: <CreateFaqs name={["faqs"]} />,
          },
          {
            label: `SEO`,
            key: "seo",
            children: <SEOComponent name={["seo"]} />,
          },
          {
            label: `Pricing`,
            key: "pricing",
            children: (
              <TestPricingEditor
                saveTest={props.saveTest}
                test={props.test}
                testId={props.testId}
              />
            ),
          },
          // {
          //   label: `Advanced`,
          //   key: 'advanced',
          //   children: (
          //     <TestAdvancedSettings
          //       saveTest={props.saveTest}
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
};

const MemoedTestInformationEditor = React.memo(TestInformationEditor);

export default MemoedTestInformationEditor;
