"use client";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import AppImage from "@Components/Image";
import { Paragraph, Title } from "@Components/Typography/Typography";
import { useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { CategoryProducts } from "../StoreScreen/ProductCategoryDetail/ProductCategoryDetail";

interface BlogDetailScreenPropsI {
  id: string;
}

export default function BlogDetailScreen(props: BlogDetailScreenPropsI) {
  const { id: blogId } = useParams();
  const id = props.id || blogId;
  const { data: blog } = Learner.Queries.useGetBlogDetails(id + "", {
    enabled: !!id,
  });
  return (
    <Row gutter={[30, 30]} style={{ marginTop: 30 }}>
      <Col xs={24} lg={12}>
        <Paragraph strong>
          <ClockCircleOutlined style={{ position: "relative", top: 1 }} />{" "}
          {dayjs(blog.updatedAt).format("LL")}
        </Paragraph>
        <Title style={{ marginTop: 0 }}>{blog.title}</Title>
        <Title level={4} style={{ marginTop: 0 }}>
          {blog.subtitle}
        </Title>
      </Col>
      <Col xs={24} lg={12}>
        <AppImage
          style={{ borderRadius: 8, width: "100%", maxHeight: 320 }}
          // height={320}
          width={"100%"}
          src={blog.thumbnailImage}
        />
      </Col>
      <Col xs={24} lg={24} style={{ marginTop: 30 }}>
        <Paragraph style={{ fontSize: 16 }}>
          <HtmlViewer content={blog.content} />
        </Paragraph>
      </Col>
      <Col xs={24} lg={24} style={{ marginTop: 30 }}>
        <Title level={3} style={{ marginTop: 0 }}>
          To master your skills, practice our tests!
        </Title>
        <CategoryProducts categoryId={blog.category} />
      </Col>
    </Row>
  );
}
