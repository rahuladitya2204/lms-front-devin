"use client";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import { useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { Card, Col, Row } from "antd";
import { PackageListComponent } from "../../../StoreScreen/ProductCategoryDetail/ProductCategoryTabs";

interface PackageDetailViewerPropsI {
  isServer?: boolean;
  children?: React.ReactNode;
  slug?: string;
}

export default function PackagesList(props: PackageDetailViewerPropsI) {
  const params = useParams();
  const slug = props.slug || params.slug;
  const { data: category } =
    Learner.Queries.useGetProductCategoryDetailsFromTestSeriesSlug(slug + "");
  console.log(category, "category");
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Title>{category?.testSeries?.page?.title}</Title>
      </Col>
      <Col span={24}>
        <PackageListComponent isServer={props.isServer} id={category._id} />
      </Col>
      <Col span={24}>
        <Card>
          <HtmlViewer content={category?.testSeries?.page?.content} />
        </Card>
      </Col>
    </Row>
  );
}
