import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  TreeSelect,
} from "antd";
import { Constants, Types, User } from "@adewaskar/lms-common";
import React, { useEffect } from "react";
import InputTags from "@Components/InputTags/InputTags";
import TextArea from "@Components/Textarea";
import { useParams } from "@Router/index";
import { useCourseStore } from "../../useCourseStore";
import { useOutletContext } from "react-router";
import useUpdateCourseForm from "../useUpdateCourseForm";
import TopicSelect from "@Components/TopicSelect";
import Tabs from "@Components/Tabs";
import CreateFaqs from "@Components/CreateFaqsComponent";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { confirm } = Modal;

interface AddTextItemPropsI {
  language: string;
}

const AddTextItem: React.FC = (props: AddTextItemPropsI) => {
  const { itemId, id: courseId } = useParams();
  const form = Form.useFormInstance();
  const { language } = useOutletContext();
  const { mutate: generateFAQs, isLoading: generatingFAQs } = User.Queries.GenerateFAQsFromDescription();
  const course = useCourseStore(s => s.course)
  const prefixKey = `course/${courseId}/${itemId}`;
  const ContentComponent = (field: string) => {
    return <Col span={24}>
      <Form.Item
        name={["title", "text", language]}
        label="Title"
        required
        rules={[{ required: true, message: "Enter the title" }]}
      >
        <Input />
      </Form.Item>
      <Row gutter={[15, 15]}>
        <Col span={12}>
          <TopicSelect
            level={4}
            label="Topic"
            notDisabled
            topicId={course.topics}
            name="topic"
          /></Col>
        <Col span={12}>
          <Form.Item label="Tags" name="tags">
            <InputTags name="tags" />
          </Form.Item></Col>
      </Row>
      <Form.Item
        name={[field, "text", language]}
        label="Content"
        required
      >
        <TextArea modifyCta
          name={[field, "text", language]}
          uploadPrefixKey={prefixKey}
          height={800}
          html={{ level: 3 }}
        />
      </Form.Item>
      <Card title={'FAQs'} extra={[<Button onClick={() => generateFAQs({
        text: form.getFieldsValue().description.text[language],
        language: language
      }, {
        onSuccess: (faqs: Types.FAQ[]) => {
          console.log(faqs, 'ssssss')
          const currentFAQs = form.getFieldValue(['faqs']) || [];
          faqs.forEach((faq, index) => {
            if (!currentFAQs[index]) {
              currentFAQs[index] = { title: Constants.INITIAL_LANG_TEXT, description: Constants.INITIAL_LANG_TEXT }
            }
            currentFAQs[index].title[language] = faq.title;
            currentFAQs[index].description[language] = faq.description;
          })
          console.log(currentFAQs, 'currentFAQs')
          form.setFieldValue(['faqs'], currentFAQs)
        }
      })} loading={generatingFAQs} size='small'>Generate FAQS</Button>]}>
        <Form.Item>
          <Form.List name={'faqs'}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[40, 0]}>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "title", language]}
                        rules={[
                          { required: true, message: "Missing FAQ title" },
                        ]}
                        label={`FAQ ${name + 1} Title`}
                      >
                        <Input placeholder="Enter FAQ title" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "description", language]}
                        rules={[
                          {
                            required: true,
                            message: "Missing FAQ description",
                          },
                        ]}
                        label={`FAQ ${name + 1} Description`}
                      >
                        <TextArea height={200} html={{ level: 3 }} placeholder="Enter FAQ description" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          Modal.confirm({
                            closable: false,
                            title: `Are you sure?`,
                            // icon: <ExclamationCircleOutlined />,
                            content: `You want to delete this FAQ?`,
                            // footer: [

                            // ],
                            onOk() {
                              remove(name);
                            },
                            okText: "Yes, Delete",
                          });
                        }}
                      >
                        {/* Remove */}
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add FAQ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Card>
    </Col>
  }
  const tabItems = [{
    label: 'Detailed Version',
    key: 'description',
    children: ContentComponent('description')
  },
  {
    label: 'Revision Version',
    key: 'shortDescription',
    children: ContentComponent('shortDescription')
  }]
  return (
    <Spin spinning={false}>
      <Row gutter={[10, 0]}>
        <Col span={24}>
          <Tabs tabKey="course-content-tab" items={tabItems} /></Col>
      </Row>
    </Spin>
  );
};

export default AddTextItem
