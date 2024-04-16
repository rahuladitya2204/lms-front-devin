"use client";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import { useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { Col, Row } from "antd";

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
    <Row>
      <Col span={24}>
        <Title>{blog.title}</Title>
      </Col>
      <Col span={24}>
        <HtmlViewer content={blog.content} />
      </Col>
    </Row>
  );
}
