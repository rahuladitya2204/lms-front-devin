import { Button, Card, Col, Form, Input, Row, Select } from "antd";
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

interface PackageDetailsPropsI {
  packageId: string;
}

export default function PackageDetails(props: PackageDetailsPropsI) {
  const form = Form.useFormInstance();
  const { packageId } = props;
  const image = Form.useWatch("thumbnailImage", form);
  const { data: bundle } = User.Queries.useGetPackageDetails(packageId, {
    enabled: !!props.packageId,
  });

  const testimonials = Form.useWatch(["testimonials"], form);
  const setTestimonials = (t: Types.Testimonial[]) => {
    form.setFieldValue(["testimonials"], t);
  };

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
            rules={[
              {
                required: true,
                message: "Please enter a subtitle of the packages",
              },
            ]}
            name="subtitle"
            label="Sub Title"
            required
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
            required
          >
            <Input placeholder="Enter a slug for the live session" />
          </Form.Item>
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <SelectProductCategory name="category" />
            </Col>
            <Col span={12}>
              <InputTags label="Keywords" name="keywords" />
            </Col>
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
      <Row gutter={[20, 20]}>
        <Col span={24}>
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
        </Col>
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
