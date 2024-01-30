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
  TreeSelect
} from 'antd'
import { Constants, Enum, Types, User } from '@adewaskar/lms-common'
import { useEffect, useMemo } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import CreateCategory from '@User/Screens/Categories/CreateCategory'
import GenerateWithAI from '../GenerateWithAiButton'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import SelectProductCategory from '@Components/SelectProductCategory'
import { TopicNode } from '@User/Screens/Admin/Topics/TopicsScreen'
import { Typography } from '@Components/Typography'
import dayjs from 'dayjs'
import { deepPatch } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useParams } from 'react-router'

const { TextArea } = Input

const { Text } = Typography

const LANGUAGES = [
  {
    value: Enum.LanguageEnum.ENGLIGH,
    label: 'English'
  },
  {
    value: Enum.LanguageEnum.HINDI,
    label: 'Hindi'
  },
  {
    value: Enum.LanguageEnum.FRENCH,
    label: 'French'
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
  const { data: users } = User.Queries.useGetUsers()
  const image = useWatch(['thumbnailImage'], form)
  const isDurationEnabled = useWatch(['duration', 'enabled'], form)
  const { listItems: categories } = User.Queries.useGetProductCategories('test')
  const { data: topics } = User.Queries.useGetTopics()
  const TOPIC_TREE_DATA = useMemo(
    () => {
      return buildTopicTree(topics)
    },
    [topics]
  )
  useEffect(
    () => {
      if (test.live.scheduledAt) {
        console.log(test, 'fff')
        // @ts-ignore
        test.live.scheduledAt = dayjs(test.live.scheduledAt)
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
  const isLive = Form.useWatch(['live', 'enabled'], form)
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
          compress={{ quality: 0.8, maxHeight: 200, maxWidth: 330 }}
          cropper={{ width: 330, height: 200 }}
          aspect={16 / 9}
          name="thumbnailImage"
          width="200px"
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

      <Form.Item name="subtitle" label="Subtitle">
        <Input />
      </Form.Item>
      <Form.Item
        name={'description'}
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
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum passing score'
            //   }
            // ]}
            name="passingScore"
            label="Minimum Passing Score"
            // required
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
                {/* {isPublished ? '(Cannot change duration once published)' : ''}{' '} */}
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
            name={['duration', 'value']}
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
          <Form.Item
            // label=""
            label={`Input Type`}
            name={['input', 'type']}
            rules={[
              { required: true, message: 'Please select user input mode' }
            ]}
          >
            <Select
              options={[
                {
                  label: 'Handwritten Images',
                  value: Enum.TestInputType.HANDWRITTEN
                },
                {
                  label: 'Keyboard',
                  value: Enum.TestInputType.KEYBOARD
                }
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            // label=""
            label={`Topic`}
            name={['topic']}
            rules={[{ required: true, message: 'Please select a topic' }]}
          >
            <TreeSelect treeData={TOPIC_TREE_DATA} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Row gutter={[0, 20]} justify={'end'}>
            <Col flex={1}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please enter start time for the live test'
                  }
                ]}
                name={['live', 'scheduledAt']}
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
                        name={['live', 'enabled']}
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
        {/* <Col span={12}>
          <Form.Item style={{ margin: 0 }} name={['mode']} label="Test Mode">
            <Select
              options={[
                {
                  label: 'Online',
                  value: `online`
                },
                {
                  label: 'Offline',
                  value: `offline`
                }
              ]}
            />
          </Form.Item>
        </Col> */}
        {isLive ? (
          <Col span={8}>
            <Form.Item
              label="Select Result Trigger"
              name={['live', 'result', 'trigger']}
            >
              <Select
                showSearch
                placeholder="Select Result Trigger"
                options={[
                  { label: 'Manual', value: 'manual' },
                  { label: 'Immediate', value: 'immediate' }
                ]}
              />
            </Form.Item>
          </Col>
        ) : null}
      </Row>
      <Divider />

      <Row gutter={[40, 20]}>
        <Col span={12}>
          <Form.Item
            name="languages"
            required
            label="Languages"
            rules={[{ required: true, message: 'Please select a language' }]}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Select Language"
              options={LANGUAGES}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <SelectProductCategory name={['category']} />
        </Col>
      </Row>
    </Form>
  )
}

export default TestDetailsEditor

export const buildTopicTree = (topics: Types.Topic[]) => {
  const buildTreeData = (topics: Types.Topic[]): TopicNode[] => {
    // @ts-ignore
    return topics.filter(topic => !topic.parentId).map(topic => ({
      ...topic,
      value: topic._id,
      title: topic.title,
      children: buildSubTreeData(topic._id + '', topics)
    }))
  }

  const buildSubTreeData = (
    parentId: string,
    topics: Types.Topic[]
  ): TopicNode[] => {
    const subTopics = topics
      .filter(topic => topic.parentId === parentId)
      .map(topic => ({
        ...topic,
        value: topic._id,
        title: topic.title,
        children: buildSubTreeData(topic._id + '', topics)
      }))
    // @ts-ignore
    return [...subTopics]
  }

  return buildTreeData(topics)
}
