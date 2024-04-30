"use client";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import AppImage from "@Components/Image";
import { Paragraph, Title } from "@Components/Typography/Typography";
import { useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Card, Col, Row, Skeleton } from "antd";
import dayjs from "dayjs";
import { CategoryProducts } from "../StoreScreen/ProductCategoryDetail/ProductCategoryDetail";

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
            <HtmlViewer content={blog.content} />
          </Paragraph>
        </Col>
        {/* <Col xs={24} lg={24} style={{ marginTop: 30 }}>
        <Title level={3} style={{ marginTop: 0 }}>
          To master your skills, practice our tests!
        </Title>
        <CategoryProducts categoryId={blog.category} />
      </Col> */}
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
