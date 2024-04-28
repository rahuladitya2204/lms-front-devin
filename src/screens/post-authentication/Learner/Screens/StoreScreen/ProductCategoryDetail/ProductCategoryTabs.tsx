"use client";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Paragraph, Text } from "@Components/Typography/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import { Link, NavLink, useNavigate, useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import styled from "@emotion/styled";
import { Button, Card, Divider, Skeleton, Tabs } from "@Lib/index";
import { useMemo } from "react";
import { Outlet } from "react-router";

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
  product?: string;
  // children?: string;
}

export default function ProductCategoryTabs(props: ProductCategoryTabsPropsI) {
  const params = useParams();
  const id = props.id || params.id;
  const type = props.type || params.type || "overview";
  const product = props.product || params.product || "packages";
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
    ];

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
    <Card style={{ marginTop: 20 }}>
      {TABS.map((tab) => {
        return (
          <Button
            onClick={() => {
              navigate(
                props.isServer
                  ? `/exam/${props.id}/${product}/${tab.key}`
                  : `/app/exam/${id}/${product}/${tab.key}`
              );
            }}
            // type="text"
            size="small"
            type={tab.key === type ? "primary" : "default"}
            style={{ marginRight: 15, marginBottom: 10 }}
          >
            {tab.label}
          </Button>
        );
      })}
      <Divider style={{ margin: "5px 0px 0px 0" }} />
      {
        <HtmlViewer
          content={TABS.find((tab) => tab.key === type)?.description + ""}
        />
      }
    </Card>
  );
}
