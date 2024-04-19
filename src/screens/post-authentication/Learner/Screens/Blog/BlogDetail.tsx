"use client";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import AppImage from "@Components/Image";
import { Paragraph, Title } from "@Components/Typography/Typography";
import { useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import dayjs from "dayjs";

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
    <Row style={{ marginTop: 30 }}>
      <Col xs={24} lg={12}>
        <Paragraph strong>
          <ClockCircleOutlined style={{ position: "relative", top: 1 }} />{" "}
          {dayjs(blog.updatedAt).format("LL")}
        </Paragraph>
        <Title style={{ marginTop: 0 }}>{blog.title}</Title>
        <Paragraph style={{ marginTop: 0 }}>{blog.subtitle}</Paragraph>
      </Col>
      <Col xs={24} lg={12}>
        <AppImage
          style={{ borderRadius: 8 }}
          height={320}
          src={blog.thumbnailImage}
        />
      </Col>
      <Col xs={24} lg={24} style={{ marginTop: 30 }}>
        <HtmlViewer content={blog.content} />
      </Col>
    </Row>
  );
}
