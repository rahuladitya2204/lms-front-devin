import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Tag,
  message,
} from "@Lib/index";
import { Enum, Types, Utils } from "@adewaskar/lms-common";
import React, { Fragment, ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "@Router/index";

import BackButton from "@Components/BackButton";

import Header from "@Components/Header";

import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import TextArea from "@Components/Textarea";
import AppImage from "@Components/Image";
import MediaUpload from "@Components/MediaUpload";
import SelectProductCategory from "@Components/SelectProductCategory";
import InputTags from "@Components/InputTags/InputTags";

const { confirm } = Modal;
interface CreateBlogComponentPropsI {
  // data: Types.Blog;
  children?: ReactNode;
  closeModal?: Function;
  onSuccess?: () => void;
  onFinish?: (data: Types.Blog) => void;
}

const CreateBlog: React.FC<CreateBlogComponentPropsI> = (props) => {
  const { blogId } = useParams();

  const isEdit = !!blogId;
  const navigate = useNavigate();
  const { mutate: createBlog, isLoading: createBlogLoading } =
    User.Queries.useCreateBlog();
  const { mutate: updateBlog, isLoading: updateBlogLoading } =
    User.Queries.useUpdateBlog();
  const { mutate: publishBlog, isLoading: publishingBlog } =
    User.Queries.usePublishBlog();
  const { mutate: unpublishBlog, isLoading: unpublishingBlog } =
    User.Queries.useUnpublishBlog();
  const { data: blogDetails, isLoading: loadingBlog } =
    User.Queries.useGetBlogDetails(blogId + "", {
      enabled: !!blogId,
    });
  useEffect(() => {
    console.log(blogDetails, "blogDetailsblogDetails");
    form.setFieldsValue(blogDetails);
  }, [blogDetails]);

  const [form] = Form.useForm<Types.Blog>();
  const image = Form.useWatch("thumbnailImage", form);

  const onSubmit = (e: Types.Blog) => {
    const data = {
      ...e,
    };
    if (isEdit) {
      updateBlog(
        { id: blogId, data: data },
        {
          onSuccess: () => {
            message.open({
              type: "success",
              content: "Blog updated",
            });
          },
        }
      );
    } else {
      // @ts-ignore
      createBlog(
        { data: data },
        {
          onSuccess: () => {
            //  navigate('../');
            message.open({
              type: "success",
              content: "Blog Created",
            });
            props.onSuccess && props.onSuccess();
            props.closeModal && props.closeModal();
          },
        }
      );
    }
  };
  const isBlogValid = Utils.validatePublishBlog(blogDetails);
  const PublishBlog = (
    <Button
      loading={publishingBlog}
      key="submit"
      type="primary"
      disabled={!isBlogValid}
      onClick={() => {
        confirm({
          title: "Are you sure?",
          content: `You want to publish this blog?`,
          onOk() {
            publishBlog({
              blogId: blogId + "",
            });
          },
          okText: "Yes, Publish",
        });
      }}
    >
      Publish Blog
    </Button>
  );
  const UnpublishBlog = (
    <Button
      style={{ marginRight: 10 }}
      onClick={() => {
        confirm({
          title: "Are you sure?",
          content: `You want to unpublish this blog? Will be moved to Draft`,
          onOk() {
            unpublishBlog({
              blogId: blogId + "",
            });
          },
          okText: "Yes, Publish",
        });
      }}
    >
      Revert to Draft
    </Button>
  );
  const SaveBlog = (
    <Button
      style={{ marginLeft: 10 }}
      loading={createBlogLoading || updateBlogLoading}
      key="submit"
      type="primary"
      onClick={form.submit}
    >
      Save Details
    </Button>
  );
  console.log(isBlogValid, "isBlogValid");
  return (
    <Header
      onBack={() => navigate("/admin/blogs")}
      title={
        <span>
          <BackButton
            // disabled={!blogDetails.category}
            onClick={() => navigate(`/admin/products/blogs`)}
          />{" "}
          {blogDetails._id ? blogDetails.title : "Create Blog"}
          {blogDetails.status !== Enum.BlogStatus.PUBLISHED
            ? PublishBlog
            : null}
        </span>
      }
      extra={[
        ...(blogDetails.status === Enum.BlogStatus.PUBLISHED
          ? [UnpublishBlog, <Tag color="green">Published</Tag>]
          : []),
        // ((blogDetails.status !== Enum.BlogStatus.PUBLISHED))?PublishBlog:null,
        SaveBlog,
      ]}
    >
      {/* <Spin  spinning={loadingBlog}> */}
      <Card>
        <Row gutter={[20, 30]}>
          <Col span={24}>
            <>
              <Form form={form} onFinish={onSubmit} layout="vertical">
                <Fragment>
                  <Row gutter={[20, 20]}>
                    <Col span={16}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "Please enter a title of the blogs",
                          },
                        ]}
                        name="title"
                        label="Blog Title"
                        required
                      >
                        <Input placeholder="Enter a subtuitle for the live session" />
                      </Form.Item>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "Please enter a subtitle of the blogs",
                          },
                        ]}
                        name="subtitle"
                        label="Sub Title"
                        required
                      >
                        <Input placeholder="Enter a title for the live session" />
                      </Form.Item>
                      <Row gutter={[20, 20]}>
                        <Col span={12}>
                          <SelectProductCategory name="category" />
                        </Col>
                        <Col span={12}>
                          <InputTags label="Tags" name="tags" />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8}>
                      <Form.Item name={"thumbnailImage"}>
                        <MediaUpload
                          name={"thumbnailImage"}
                          source={{
                            type: "blog.thumbnail",
                            value: blogId + "",
                          }}
                          uploadType="image"
                          // prefixKey={`blogs/${blogId}/image`}
                          cropper={{ width: 150, height: 150 }}
                          width="100%"
                          // height="200px"
                          aspect={16 / 9}
                          renderItem={() => (
                            <AppImage preview={false} src={image} />
                          )}
                          onUpload={(file) => {
                            console.log(file, "uploaded image!");
                            form.setFieldValue("thumbnailImage", file.url);
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[20, 20]}>
                    <Col span={24}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "Please enter a content of the blogs",
                          },
                        ]}
                        name={["content"]}
                        required
                      >
                        <TextArea
                          editorType="ck"
                          height={250}
                          html={{ level: 3 }}
                          label="Content"
                          name={["content"]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Fragment>
              </Form>
            </>
          </Col>
        </Row>
      </Card>
      {/* </Spin> */}
    </Header>
  );
};

export default CreateBlog;
