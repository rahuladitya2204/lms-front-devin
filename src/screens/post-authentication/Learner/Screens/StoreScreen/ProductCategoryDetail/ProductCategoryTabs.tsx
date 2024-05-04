"use client";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Paragraph, Text } from "@Components/Typography/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import { Link, NavLink, useNavigate, useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import styled from "@emotion/styled";
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Row,
  Skeleton,
  Tabs,
} from "@Lib/index";
import { useMemo } from "react";
import { Outlet } from "react-router";
import ShowMore from "@Components/ShowMore/ShowMore";
import PackageCard from "../Cards/PackageCard";

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
  // const product = props.product || params.product || "packages";
  const { data: productCategory, isLoading: loadingCategory } =
    Learner.Queries.useGetProductCategoryDetails(id + "");
  const { data: packages, isLoading: loadingPackages } =
    Learner.Queries.useGetPackages(id + "", {
      enabled: !!id,
    });
  // const { isMobile, width } = useBreakpoint();
  const PackageListComponent = (
    <Row gutter={[20, 20]}>
      {loadingPackages
        ? [1, 1, 1, 1, 1, 1].map((i, idx) => (
            <Col sm={12} key={idx} md={8} xs={24} lg={8} xl={6} xxl={6}>
              <Skeleton.Button active block style={{ height: 200 }} />
            </Col>
          ))
        : packages.map((bundle, idx) => {
            return (
              <Col sm={12} key={idx} md={8} xs={24} lg={8} xl={6} xxl={6}>
                <PackageCard mini isServer={props.isServer} package={bundle} />
              </Col>
            );
          })}
    </Row>
  );

  const TABS = useMemo(() => {
    const i = [
      {
        label: "Overview",
        key: "overview",
        description: productCategory.landingPage.description,
        children: (
          <HtmlViewer content={productCategory.landingPage.description} />
        ),
        faqs: productCategory.info.faqs,
      },
      {
        label: "Test Series",
        key: "test-series",
        children: PackageListComponent,
        faqs: productCategory.testSeries.faqs,
      },
    ];

    i.push(
      ...productCategory.info.links.map((link) => {
        return {
          label: link.title,
          key: link.slug,
          description: link.description,
          children: <HtmlViewer content={link.description} />,
          faqs: link.faqs,
        };
      })
    );

    return i;
  }, [productCategory, packages]);
  const navigate = useNavigate();
  const tab = TABS.find((tab) => tab.key === type);
  return loadingCategory ? (
    <Skeleton.Button block active style={{ height: 400 }} />
  ) : (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Card style={{ marginTop: 20 }}>
          {TABS.map((tab) => {
            return (
              <Button
                onClick={() => {
                  navigate(
                    props.isServer
                      ? `/exam/${id}/${tab.key}`
                      : `/app/exam/${id}/${tab.key}`
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
            <ShowMore minHeight={300}>
              {tab?.children || <HtmlViewer content={tab?.description + ""} />}
            </ShowMore>
          }
        </Card>
      </Col>
      {tab?.faqs?.length ? (
        <Col lg={24} md={24} sm={24} xs={24}>
          <Card title="FAQs">
            {tab?.faqs?.map((faq, idx) => {
              return (
                <Collapse
                  expandIconPosition="end"
                  style={{ marginTop: 10 }}
                  key={idx}
                  items={[
                    {
                      label: faq.title,
                      children: <Paragraph>{faq.description}</Paragraph>,
                    },
                  ]}
                />
              );
            })}
          </Card>
        </Col>
      ) : null}
    </Row>
  );
}
