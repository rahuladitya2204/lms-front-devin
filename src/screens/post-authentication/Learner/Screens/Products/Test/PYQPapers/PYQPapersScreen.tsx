"use client";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import { useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { Card, Col, Row } from "antd";
import { PackageListComponent } from "../../../StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { FAQsList } from "@Components/CreateFaqsComponent";
import { PYQTestsComponent } from "../../../StoreScreen/ProductCategoryDetail/ProductCategoryDetail";
import ShowMore from "@Components/ShowMore/ShowMore";

interface PYQPapersScreenPropsI {
  isServer?: boolean;
  children?: React.ReactNode;
  slug?: string;
}

export default function PYQPapersScreen(props: PYQPapersScreenPropsI) {
  const params = useParams();
  const slug = props.slug || params.slug;
  const { data: category } =
    Learner.Queries.useGetProductCategoryDetailsFromPYQPapersSlug(slug + "");
  console.log(category, "category");
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Title>{category?.pyq?.page?.title}</Title>
      </Col>
      <Col span={24}>
        <ShowMore minHeight={200}>
          <PYQTestsComponent
            isServer={props.isServer}
            categoryId={category._id}
          />
        </ShowMore>
      </Col>
      {category?.pyq?.page?.content ? (
        <Col span={24}>
          <Card>
            <HtmlViewer content={category?.pyq?.page?.content} />
          </Card>
        </Col>
      ) : null}
      {category.pyq.faqs.length ? (
        <Col span={24}>
          <Card title="FAQs">
            <FAQsList faqs={category.pyq.faqs} />
          </Card>
        </Col>
      ) : null}
    </Row>
  );
}
