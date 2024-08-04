"use client";
import { Title } from "@Components/Typography/Typography";
import { Learner } from "@adewaskar/lms-common";
import { Col, Row, Skeleton } from "antd";
import BlogCard from "../StoreScreen/Cards/BlogCard";
import { useEffect } from "react";
import { LogEvent } from "@ServerHooks/useDehydration";

export default function LearnerBlogsScreen(props: { isServer?: boolean }) {
  const { data: blogs, isLoading: loadingBlogs } =
    Learner.Queries.useGetBlogs();

  useEffect(() => {
    if (blogs.length) {
      LogEvent("Blog", "BlogsScreen::Loaded", "Blog List", {
        blogssLoaded: blogs.length,
      }); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
    }
  }, [blogs]);

  return loadingBlogs ? (
    <LearnerBlogsSKeletonScreen />
  ) : (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Title>Please check out our blogs</Title>
      </Col>
      <Col span={24}>
        <Row gutter={[20, 30]}>
          {blogs.map((blog) => (
            <Col lg={4} md={6} sm={12} xs={24}>
              <BlogCard isServer={props.isServer} blog={blog} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}

export function LearnerBlogsSKeletonScreen(props: { isServer?: boolean }) {
  const blogs = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Skeleton.Button active block style={{ height: 45 }} />
      </Col>
      <Col span={24}>
        <Row gutter={[20, 30]}>
          {blogs.map((blog) => (
            <Col lg={4} md={6} sm={12} xs={24}>
              <Skeleton.Button active block style={{ height: 200 }} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
