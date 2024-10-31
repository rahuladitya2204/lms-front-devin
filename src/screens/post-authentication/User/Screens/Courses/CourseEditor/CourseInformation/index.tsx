import { Button, Card, Col, Form, message, Row } from "@Lib/index";
import { Constants, Types } from "@adewaskar/lms-common";
import { EyeOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Fragment, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useParams } from "@Router/index";

import { Course } from "@adewaskar/lms-common/lib/cjs/types/types/Courses.types";
import CourseAdvancedSettings from "./CourseAdvancedSettings/CourseAdvancedSettings";
import CourseDetailsEditor from "./CourseDetailsEditor/CourseDetails";
import CourseLandingPageEditor from "./CourseLandingPage/CourseLandingPageEditor";
import CoursePricingEditor from "./CoursePricingEditor/CoursePricingEditor";
import Header from "@Components/Header";
import Tabs from "@Components/Tabs";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import { useCourseStore } from "../CourseBuilder/useCourseStore";

function CourseInformationEditor(props: any) {
  return (
    <Fragment>
      {/* <Form onFinish={saveCourse} layout='vertical' form={form}> */}
      <Tabs
        destroyInactiveTabPane={false}
        tabKey="course-detail"
        items={[
          {
            label: `Details`,
            active: true,
            key: "details",
            children: (
              <CourseDetailsEditor />
            ),
          },
          {
            label: `Landing Page`,
            key: "landing-page",
            children: (
              <CourseLandingPageEditor />
            ),
          },
          {
            label: `Pricing`,
            key: "pricing",
            children: (
              <CoursePricingEditor
              />
            ),
          },
          {
            label: `Advanced`,
            key: "advanced",
            children: (
              <CourseAdvancedSettings />
            ),
          },
        ]}
      />
      {/* </Form> */}

    </Fragment>
  );
}

export default CourseInformationEditor;
