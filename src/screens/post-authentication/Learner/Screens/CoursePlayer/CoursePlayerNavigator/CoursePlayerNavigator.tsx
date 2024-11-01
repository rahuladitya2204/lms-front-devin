// @ts-nocheck
import { Collapse, List, Progress, Skeleton, Space } from "antd";
import { Learner, Types } from "@adewaskar/lms-common";
import React, { Fragment } from "react";

import CoursePlayerNavigatorItem from "./CoursePlayerNavigatorItem";
import { Typography } from "@Components/Typography";
import styled from "@emotion/styled";
import { useOutletContext } from "react-router";

const { Panel } = Collapse;
const { Text, Title } = Typography;

const CustomCollapse = styled(Collapse)`
  margin-top: 10px;

  div.ant-collapse {
    border-radius: 0 !important;
  }

  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-list-item {
    padding: ${({ isMobile }) => (isMobile ? "8px" : "15px")};
  }
`;

interface CoursePlayerNavigatorPropsI {
  courseId: string;
  searchText: string;
  language: string;
  toggleItemCheck: (itemID: string, value: boolean) => void;
  isMobile?: boolean;
}

function CoursePlayerNavigator({
  courseId,
  searchText,
  language,
  toggleItemCheck,
  isMobile = false,
}: CoursePlayerNavigatorPropsI) {
  const {
    data: {
      product: { data: course },
    },
    isFetching: loadingCourse,
    isLoading,
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: "course",
      id: courseId,
    },
    {
      enabled: !!courseId,
    }
  );

  const sections: Types.CourseSection[] = course?.sections || [];
  const text = searchText.toLowerCase();
  return (
    <Fragment>
      {loadingCourse ? "fetching" : ""} {isLoading ? "loading" : ""}
      {sections
        .filter((s) => {
          const sectionTitle = s.title?.text[language]?.toLowerCase();
          return (
            s.items.filter((item) => {
              const title = item.title?.text[language]?.toLowerCase();
              return title?.includes(text);
            }).length || sectionTitle?.includes(text)
          );
        })
        ?.map((section, index) => {
          const itemsCompleted = section.items.filter(
            (item) => item.isCompleted
          );
          const sectionProgress = Math.ceil(
            (itemsCompleted.length / section.items.length) * 100
          );

          return (
            <CustomCollapse
              isMobile={isMobile}
              expandIconPosition="end"
              defaultActiveKey={sections.map((s) => s._id)}
              key={section._id}
            >
              <Panel
                header={
                  <Space>
                    <Progress
                      format={() => <Text strong>{index + 1}</Text>}
                      type="circle"
                      percent={sectionProgress}
                      width={isMobile ? 25 : 35}
                    />
                    <Title level={isMobile ? 5 : 4} style={{ marginTop: 0 }}>
                      {section.title?.text[language]}
                    </Title>
                  </Space>
                }
                key={section._id}
              >
                <List
                  loading={loadingCourse}
                  dataSource={section.items.filter((item) => {
                    const title = item.title?.text[language]?.toLowerCase();
                    return title?.includes(text);
                  })}
                  renderItem={(item, itemIndex) => (
                    <CoursePlayerNavigatorItem
                      courseId={courseId}
                      section={section}
                      language={language}
                      toggleItemCheck={toggleItemCheck}
                      item={item}
                      itemIndex={index + itemIndex + 1}
                      key={item._id}
                    />
                  )}
                />
              </Panel>
            </CustomCollapse>
          );
        })}
    </Fragment>
  );
}

export default CoursePlayerNavigator;
