import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Switch,
} from "antd";
import { Enum, Types, User } from "@adewaskar/lms-common";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import ActionModal from "@Components/ActionModal/ActionModal";
import AddTestimonial from "@User/Screens/ExtraComponents/Testimonials/AddTestomonial";
import AppImage from "@Components/Image";
import { DeleteOutlined } from "@ant-design/icons";
import InputTags from "@Components/InputTags/InputTags";
import MediaUpload from "@Components/MediaUpload";
import ProductCard from "@Components/UserProductCard";
import ProductRow from "./Products/ProductRow";
import SelectProductCategory from "@Components/SelectProductCategory";
import Testimonials from "@User/Screens/ExtraComponents/Testimonials/Testimonials";
import TextArea from "@Components/Textarea";
import { validateSlug } from "@Components/Editor/SunEditor/utils";
import { capitalize, cloneDeep } from "lodash";
import dayjs from "dayjs";
import FileList from "@Components/FileList";

interface PackageDetailsPropsI {
  packageId: string;
}

export default function PackageDetails(props: PackageDetailsPropsI) {
  const form = Form.useFormInstance();
  const { packageId } = props;
  const image = Form.useWatch("thumbnailImage", form);
  const { data } = User.Queries.useGetPackageDetails(packageId, {
    enabled: !!props.packageId,
  });

  const bundle = useMemo(() => {
    return {
      ...data,
      // featured: {
      //   ...(data?.featured || {}),
      //   from: data?.featured?.from ? dayjs(data.featured.from) : dayjs(),
      //   to: data?.featured?.to ? dayjs(data.featured.to) : dayjs(),
      // },
    };
  }, [data]);
  const { data: subscriptionPlans } = User.Queries.useGetGlobalPlans();
  const isFeatured = Form.useWatch(["featured", "enabled"], form);
  const isRefundEnabled = Form.useWatch(["refund", "enabled"], form);
  const testimonials = Form.useWatch(["testimonials"], form);
  const setTestimonials = (t: Types.Testimonial[]) => {
    form.setFieldValue(["testimonials"], t);
  };
  const { mutateAsync: validateSlugApi, status: validatingStatus } =
    User.Queries.useValidateSlug("package");
  const promotionImages = Form.useWatch(["promotion", "files"], form) || [];
  const isPurchaseEnabled = Form.useWatch(["purchase", 'enabled'], form);

  return (
    <Fragment>
      <Row gutter={[20, 20]}>
        <Col span={16}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please enter a title of the packages",
              },
            ]}
            name="title"
            label="Package Title"
            required
          >
            <Input placeholder="Enter a subtuitle for the live session" />
          </Form.Item>
          <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: "Please enter a subtitle of the packages",
            //   },
            // ]}
            name="subtitle"
            label="Sub Title"
          // required
          >
            <Input placeholder="Enter a title for the live session" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please enter a url slug of the package",
              },
            ]}
            name="slug"
            label="URL Slug"
            hasFeedback
            validateStatus={
              validatingStatus === "loading" ? "validating" : "success"
            }
            rules={[
              {
                required: true,
                message: "Please enter a slug for the test series",
              },
              {
                validator: async (rule, value) => {
                  if (bundle?.slug !== value) {
                    try {
                      await validateSlug(value, validateSlugApi);
                      return Promise.resolve();
                    } catch (error) {
                      console.log(error);
                      return Promise.reject(error);
                    }
                  }
                },
              },
            ]}
          >
            <Input placeholder="Enter a slug for the live session" />
          </Form.Item>

          <Row gutter={[20, 20]}>
            <Col span={12}>
              <SelectProductCategory name="category" />
            </Col>
            <Col span={12}>
              <Form.Item
                name={"keywords"}
                label="Keywords"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter a description for the Test",
              //   },
              // ]}
              >
                <InputTags name={`keywords`} />
              </Form.Item>{" "}
            </Col>
            <Col span={8}>
              <Form.Item label="Status" style={{ margin: 0 }} name={["status"]}>
                <Select
                  options={[
                    {
                      label: capitalize(Enum.TestStatus.DRAFT),
                      value: Enum.TestStatus.DRAFT,
                    },
                    {
                      label: capitalize(Enum.TestStatus.ENDED),
                      value: Enum.TestStatus.ENDED,
                    },
                    {
                      label: capitalize(Enum.TestStatus.PUBLISHED),
                      value: Enum.TestStatus.PUBLISHED,
                    },
                    {
                      label: capitalize(Enum.TestStatus.LIVE),
                      value: Enum.TestStatus.LIVE,
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                style={{ margin: 0, marginLeft: 10 }}
                valuePropName="checked"
                name={["purchase", "enabled"]}
                label="Purchase Enabled"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                style={{ margin: 0, marginLeft: 10 }}
                valuePropName="checked"
                name={["promotion", "enabled"]}
                label="Promoted"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                style={{ margin: 0, marginLeft: 10 }}
                valuePropName="checked"
                name={["offlineKit", "enabled"]}
                label="Offline Kit"
              >
                <Switch />
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item
                style={{ margin: 0, marginLeft: 10 }}
                valuePropName="checked"
                name={["offlineKit", "enabled"]}
                label="Offline Kit"
              >
                <Switch />
              </Form.Item>
            </Col> */}
          </Row>
        </Col>
        <Col span={8}>
          <Form.Item name={"thumbnailImage"}>
            <MediaUpload
              name={"thumbnailImage"}
              source={{
                type: "package.thumbnail",
                value: packageId + "",
              }}
              uploadType="image"
              // prefixKey={`packages/${packageId}/image`}
              cropper={{ width: 150, height: 150 }}
              width="100%"
              // height="200px"
              aspect={16 / 9}
              renderItem={() => <AppImage preview={false} src={image} />}
              onUpload={(file) => {
                console.log(file, "uploaded image!");
                form.setFieldValue("thumbnailImage", file.url);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      {isPurchaseEnabled ? <> <Divider />
        <Row>
          <Col flex={1}>
            <Row gutter={[10, 10]} align={"middle"}>
              <Col span={6}>
                <Form.Item
                  style={{ margin: 0, marginLeft: 10 }}
                  valuePropName="checked"
                  name={["featured", "enabled"]}
                // label="Is Featured"
                // label="Send email to learner on course enrollment."
                >
                  <Switch
                    checkedChildren="Is Featured"
                    unCheckedChildren="Not Featured"
                  />
                </Form.Item>
              </Col>
              {isFeatured ? (
                <Col span={6}>
                  <Form.Item
                    name={["featured", "from"]}
                    label="Featured From"
                    // style={{ width: "100%" }}
                    required
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              ) : null}
              {isFeatured ? (
                <Col span={6}>
                  <Form.Item
                    label="Featured Till"
                    name={["featured", "to"]}
                    required
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={8}>
            <Form.Item
              style={{ margin: 0, marginLeft: 10 }}
              valuePropName="checked"
              name={["refund", "enabled"]}
              label="Refund Enabled"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col style={{ display: isRefundEnabled ? "block" : "none" }} span={8}>
            <Form.Item
              style={{ margin: 0, marginLeft: 10 }}
              name={["refund", "within", "days"]}
              label="Refund Window(in days)"
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
      </> : null}

      <Divider />

      <Col span={8}>
        <Form.Item
          label="Subscription Plans"
          style={{ margin: 0 }}
          name={["subscriptions"]}
        >
          <Select
            mode="multiple"
            options={subscriptionPlans.map((i) => {
              return {
                label: i.title,
                value: i._id,
              };
            })}
          />
        </Form.Item>
      </Col>

      <Divider />
      <Row>
        <Col span={24}>
          <Card title="Promotion Images">
            <Form.Item
              name={["promotion", "files"]}
              required
            // label="Promotion Images"
            >
              <MediaUpload
                uploadType="file"
                prefixKey={`Packages/${packageId}/promoted`}
                onUpload={({ name, _id, url }) => {
                  if (_id) {
                    form.setFieldValue(
                      ["promotion", "files"],
                      [...promotionImages, { name, file: _id, url }]
                    );
                  }
                }}
              />
              {promotionImages?.length ? (
                <FileList
                  onDeleteFile={(fileId: string) => {
                    const FILES = promotionImages.filter(
                      (f: any) => f.file !== fileId
                    );
                    form.setFieldValue(["promotion", "files"], FILES);
                  }}
                  files={promotionImages}
                />
              ) : null}
            </Form.Item>
          </Card>
        </Col>
      </Row>
      <Divider />

      <Row gutter={[20, 20]}>
        {/* <Col span={24}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please enter a description of the packages",
              },
            ]}
            name={["description"]}
            required
          >
            <TextArea height={250} name={["description"]} />
          </Form.Item>
        </Col> */}
        <Col span={24}>
          <Card
            title="Testimonials"
            extra={
              <ActionModal
                cta={<Button type="primary">Add Testimonial</Button>}
              >
                <AddTestimonial
                  submit={(e: Types.Testimonial) => {
                    console.log(e, "e");
                    setTestimonials([...testimonials, e]);
                  }}
                />
              </ActionModal>
            }
          >
            <Form.Item name="testimonials" />
            <Testimonials
              deleteItem={(index) => {
                const TESTIMONIALS = [...testimonials];
                TESTIMONIALS.splice(index, 1);
                setTestimonials(TESTIMONIALS);
              }}
              testimonials={testimonials}
              submit={(index: number, e: Types.Testimonial) => {
                const TESTIMONIALS = [...testimonials];
                TESTIMONIALS[index] = e;
                setTestimonials(TESTIMONIALS);
              }}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
