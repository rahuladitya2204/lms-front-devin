"use client";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import AppImage from "@Components/Image";
import { Paragraph, Title } from "@Components/Typography/Typography";
import { useParams } from "@Router/index";
import { LogEvent } from "@ServerHooks/useDehydration";
import { Learner } from "@adewaskar/lms-common";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Card, Col, Row, Skeleton } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface BlogDetailScreenPropsI {
  id: string;
  isServer?: boolean;
}

export default function BlogDetailScreen(props: BlogDetailScreenPropsI) {
  const { id: blogId } = useParams();
  const id = props.id || blogId;
  const { data: blog, isLoading: loadingBlog } =
    Learner.Queries.useGetBlogDetails(id + "", {
      enabled: !!id,
    });

  useEffect(() => {
    if (blog._id) {
      LogEvent("Blog", "BlogDetail::Loaded", blog.title, {
        blogId: blog._id,
        title: blog.title,
      }); // Category: Course, Action: Enroll, Label: Course Name    logEvent('Course', 'Enroll', 'Course Name', 1); // Category: Course, Action: Enroll, Label: Course Name
    }
  }, [blog._id]);

  return loadingBlog ? (
    <BlogDetailSkeletonScreen />
  ) : (
    <Card>
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
            <HtmlViewer
              customStyles={`
              .html-viewer img,figure {
                border-radius: 10px;
                width: 100% !important;
                height: auto !important;
                display: block !important;
                margin: auto !important;
              }
              
              .html-viewer img {
                width: 100% !important;
              }

               .html-viewer div.ant-typography span,
               .html-viewer div.ant-typography {
                font-size: 16px !important;
               }
              `}
              content={blog.content}
            />
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
}

export function BlogDetailSkeletonScreen() {
  return (
    <Card>
      <Row gutter={[30, 30]} style={{ marginTop: 30 }}>
        <Col xs={24} lg={12}>
          <Paragraph strong>
            <Skeleton.Button
              block
              active
              style={{ height: 20, width: 108, marginBottom: 15 }}
            />
          </Paragraph>
          <Skeleton.Button
            block
            active
            style={{ height: 80, marginTop: 10, marginBottom: 15 }}
          />
          <Skeleton.Button block active style={{ height: 60 }} />
        </Col>
        <Col xs={24} lg={12}>
          <Skeleton.Button block active style={{ height: 320 }} />
        </Col>
        <Col xs={24} lg={24} style={{ marginTop: 30 }}>
          <Paragraph style={{ fontSize: 16 }}>
            <Skeleton paragraph={{ rows: 20 }} active style={{ height: 600 }} />
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
}
