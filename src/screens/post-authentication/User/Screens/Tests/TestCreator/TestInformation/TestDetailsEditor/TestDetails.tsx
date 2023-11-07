import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography
} from 'antd'
import { Constants, Enum, Types, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal'
import CreateCategory from '@User/Screens/Courses/ProductCategory/CreateCategory'
import GenerateWithAI from '../GenerateWithAiButton'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { deepPatch } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useEffect } from 'react'
import { useParams } from 'react-router'

const { TextArea } = Input

const { Text } = Typography

const LANGUAGES = [
  {
    value: 'english',
    label: 'English'
  },
  {
    value: 'hindi',
    label: 'Hindi'
  }
]
const { useWatch } = Form

interface TestDetailsEditorPropsI {
  testId?: string;
  saveTest: Function;
  test: Types.Test;
}

function TestDetailsEditor(props: TestDetailsEditorPropsI) {
  const { test } = props
  const [form] = Form.useForm()
  const { id } = useParams()
  const testId = props.testId || id
  const { data: instructors } = User.Queries.useGetInstructors()
  const image = useWatch(['thumbnailImage'], form)
  const isDurationEnabled = useWatch(['duration', 'enabled'], form)
  const { listItems: categories } = User.Queries.useGetProductCategories('test')

  useEffect(
    () => {
      if (test.scheduledAt) {
        // @ts-ignore
        test.scheduledAt = dayjs(test.scheduledAt)
      }

      form.setFieldsValue(test)
    },
    [test]
  )

  const onValuesChange = (d: Partial<Types.Test>) => {
    const data = deepPatch(test, d)
    props.saveTest(data)
  }

  const isPublished = test.status === Enum.TestStatus.PUBLISHED
  const isLive = Form.useWatch('isLive', form)
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      {/* <Form.Item name={['status']} required label="Test Status">
        <Select style={{ width: 200 }} placeholder="Select Status`">
          {STATUSES.map((category: any) => {
            return (
              <Option
                key={category.value}
                value={category.value}
                label={category.label}
              >
                {category.label}
              </Option>
            )
          })}
        </Select>
      </Form.Item> */}
      <Form.Item name="thumbnailImage" required label="Thumbnail">
        <MediaUpload
          source={{
            type: 'test.image',
            value: testId + ''
          }}
          uploadType="image"
          cropper
          aspect={16 / 9}
          name="thumbnailImage"
          width="200"
          height="300px"
          prefixKey={`Tests/${testId}/thumbnailImage`}
          renderItem={() => <Image preview={false} src={image} />}
          onUpload={e => {
            onValuesChange({ thumbnailImage: e.url })
          }}
        />
      </Form.Item>

      <Form.Item
        name="title"
        required
        label="Title"
        rules={[
          { required: true, message: 'Please enter a title for the Test' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="subtitle" required label="Subtitle">
        <Input />
      </Form.Item>
      <Form.Item
        name={'description'}
        required
        label="Description"
        rules={[
          {
            required: true,
            message: 'Please enter a description for the Test'
          }
        ]}
      >
        <TextArea rows={4} placeholder="Enter the test description" />
      </Form.Item>
      <Divider />
      <Row gutter={[40, 20]}>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter minimum passing score'
              }
            ]}
            name="passingScore"
            label="Minimum Passing Score"
            required
          >
            <Input
              type="number"
              placeholder="Please enter minimum passing score"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            // label=""
            label={
              <Space>
                Duration(in minutes){' '}
                {isPublished ? '(Cannot change duration once published)' : ''}{' '}
                <Form.Item
                  style={{ margin: 0 }}
                  valuePropName="checked"
                  name={['duration', 'enabled']}
                  // label="Send email to learner on course enrollment."
                >
                  <Switch
                    checkedChildren="Enabled"
                    unCheckedChildren="No Duration"
                  />
                </Form.Item>
              </Space>
            }
            name={['duration','value']}
            rules={[{ required: true, message: 'Please select duration!' }]}
          >
            <Input
              // readOnly={isPublished}
              disabled={!isDurationEnabled}
              type="number"
              placeholder="Enter duration in mins"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Row gutter={[0, 20]} justify={'end'}>
            <Col flex={1}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please enter start time for the live test'
                  }
                ]}
                name="scheduledAt"
                style={{ width: '100%' }}
                label={
                  <Row align="middle" justify={'space-between'}>
                    <Col flex={1}>
                      {isLive
                        ? 'Schedule Date'
                        : `Live ${
                            isPublished
                              ? '(Cannot change date/time once published)'
                              : ''
                          }`}
                    </Col>
                    <Col>
                      <Form.Item
                        style={{ margin: 0, marginLeft: 10 }}
                        valuePropName="checked"
                        name={['isLive']}
                        // label="Send email to learner on course enrollment."
                      >
                        <Switch checkedChildren="Live" unCheckedChildren="No" />
                      </Form.Item>
                    </Col>
                  </Row>
                }
                required
              >
                {isLive ? (
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={isPublished}
                    showTime
                  />
                ) : null}
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />

      <Row gutter={[40, 20]}>
        <Col span={12}>
          <Form.Item
            name="language"
            required
            label="Language"
            rules={[{ required: true, message: 'Please select a language' }]}
          >
            <Select
              showSearch
              placeholder="Select Language"
              options={LANGUAGES}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Row gutter={[0, 20]} justify={'end'}>
            <Col flex={1}>
              <Form.Item
                name={['category']}
                required
                label="Category"
                rules={[
                  { required: true, message: 'Please select a category' }
                ]}
              >
                <Select
                  options={categories}
                  style={{ width: '100%' }}
                  placeholder="Select Category"
                />
              </Form.Item>
            </Col>
            <Col style={{ display: 'flex', alignItems: 'center' }}>
              <ActionModal
                cta={
                  <Button
                    style={{ marginLeft: 10 }}
                    shape="round"
                    icon={<PlusOutlined />}
                  />
                }
              >
                <CreateCategory type="test"> </CreateCategory>
              </ActionModal>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

export default TestDetailsEditor
