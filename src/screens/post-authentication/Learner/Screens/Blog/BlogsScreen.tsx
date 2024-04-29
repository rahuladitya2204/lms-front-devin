"use client";
import { Title } from "@Components/Typography/Typography";
import { Learner } from "@adewaskar/lms-common";
import { Col, Row } from "antd";
import BlogCard from "../StoreScreen/Cards/BlogCard";

export default function LearnerBlogsScreen(props: { isServer?: boolean }) {
  const { data: blogs } = Learner.Queries.useGetBlogs();
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Title>Please check out our blogs</Title>
        <Row>
          {blogs.map((blog) => (
            <Col span={4}>
              <BlogCard isServer={props.isServer} blog={blog} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
