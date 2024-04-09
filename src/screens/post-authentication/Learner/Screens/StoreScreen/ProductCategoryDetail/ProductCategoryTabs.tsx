"use client";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Paragraph, Text } from "@Components/Typography/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import { Link, NavLink, useNavigate, useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import styled from "@emotion/styled";
import { Button, Divider, Skeleton, Tabs } from "antd";
import { useMemo } from "react";

const CustomTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin-left: 15px;
  }

  .ant-tabs-tab-active {
  }
`;

interface ProductCategoryTabsPropsI {
  id?: string;
  type?: string;
  isServer?: boolean;
}

export default function ProductCategoryTabs(props: ProductCategoryTabsPropsI) {
  const params = useParams();
  const id = props.id || params.id;
  const type = props.type || params.type || "overview";
  const { data: productCategory, isLoading: loadingCategory } =
    Learner.Queries.useGetProductCategoryDetails(id + "");
  const { isMobile, width } = useBreakpoint();
  const TABS = useMemo(() => {
    const i = [
      {
        label: "Overview",
        key: "overview",
        description: productCategory.landingPage.description,
        children: (
          <Paragraph style={{ fontSize: 16 }}>
            <HtmlViewer content={productCategory.landingPage.description} />
          </Paragraph>
        ),
      },
      // ...productCategory.info.links.map(link => {
      //   return {
      //     label: link.title,
      //     key:link.title,
      //     children:<HtmlViewer content={link.description} />
      //   }
      // })
    ];
    // if (packages.length) {
    //   i.push({
    //     label: `Test Series(${packages.length})`,
    //     key: 'tests',
    //     children: <Row gutter={[20,20]}>
    //       {packages.map(bundle => {
    //        return  <Col   sm={12}
    //        md={8} xs={24}
    //          lg={8} xl={6} xxl={6}  >
    //          <PackageCard package={bundle} />
    //        </Col>
    //      })}
    //     </Row>
    //   })
    // }

    i.push(
      ...productCategory.info.links.map((link) => {
        return {
          label: link.title,
          key: link.title.split(" ").join(""),
          description: link.description,
          children: <HtmlViewer content={link.description} />,
        };
      })
    );

    return i;
  }, [productCategory]);
  const navigate = useNavigate();
  return loadingCategory ? (
    <Skeleton.Button block active style={{ height: 400 }} />
  ) : (
    <>
      {TABS.map((tab) => {
        return (
          <NavLink
            to={
              props.isServer
                ? `/category/${props.id}/${tab.key}`
                : `/category/${id}/${tab.key}`
            }
          >
            <Button
              // type="text"
              size="small"
              type={tab.key === type ? "primary" : "default"}
              style={{ marginRight: 15, marginBottom: 10 }}
            >
              {tab.label}
            </Button>
          </NavLink>
        );
      })}
      <Divider />
      {
        <HtmlViewer
          content={TABS.find((tab) => tab.key === type)?.description + ""}
        />
      }
    </>
  );
}
