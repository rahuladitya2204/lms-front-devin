"use client";

import { useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { Col, Row } from "antd";

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
    <Row>
      <Col span={24}>{category.title}</Col>
    </Row>
  );
}
