"use client";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import { useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { Card, Col, Row } from "antd";
import { PackageListComponent } from "../../../StoreScreen/ProductCategoryDetail/ProductCategoryTabs";
import { FAQsList } from "@Components/CreateFaqsComponent";

interface PackageDetailViewerPropsI {
  isServer?: boolean;
  children?: React.ReactNode;
  exam?: string;
}

export default function PackagesExamScreen(props: PackageDetailViewerPropsI) {
  const params = useParams();
  const examSlug = props.exam || params.exam;
  const { data: category } =
    Learner.Queries.useGetProductCategoryDetailsFromExamSlug(examSlug + "", {
      enabled: !!examSlug,
    });
  const exam = category.exams.find((e) => e.page.slug === examSlug);
  console.log(category, exam, "category");
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Title>{exam?.page?.title}</Title>
      </Col>
      <Col span={24}>
        <PackageListComponent isServer={props.isServer} id={category._id} />
      </Col>
      {exam?.page?.content ? (
        <Col span={24}>
          <Card>
            <HtmlViewer content={exam?.page?.content} />
          </Card>
        </Col>
      ) : null}
      {exam.faqs.length ? (
        <Col span={24}>
          <Card title="FAQs">
            <FAQsList faqs={exam?.faqs} />
          </Card>
        </Col>
      ) : null}
    </Row>
  );
}
