"use client";
import { Title } from "@Components/Typography/Typography";
import { Learner } from "@adewaskar/lms-common";
import { Col, Row } from "antd";
import BlogCard from "../StoreScreen/Cards/BlogCard";

export default function LearnerBlogsScreen() {
  const { data: blogs } = Learner.Queries.useGetBlogs();
  return (
    <Row>
      <Col span={24}>
        <Title>Please check out our blogs</Title>
        <Row>
          {blogs.map((blog) => (
            <Col span={4}>
              <BlogCard blog={blog} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
