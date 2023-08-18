import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import { Constants, Types, User } from '@adewaskar/lms-common'

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

interface LiveTestDetailsEditorPropsI {
  liveTestId?: string;
  saveLiveTest: Function;
  liveTest: Types.LiveTest;
}

function LiveTestDetailsEditor(props: LiveTestDetailsEditorPropsI) {
  const { liveTest } = props
  const [form] = Form.useForm()
  const { id } = useParams()
  const liveTestId = props.liveTestId || id
  const { data: instructors } = User.Queries.useGetInstructors()
  const image = useWatch(['image'], form)
  const { listItems: categories } = User.Queries.useGetProductCategories(
    'live-test'
  )

  useEffect(
    () => {
      if (liveTest.scheduledAt) {
        // @ts-ignore
        liveTest.scheduledAt = dayjs(liveTest.scheduledAt)
      }

      form.setFieldsValue(liveTest)
    },
    [liveTest]
  )

  const onValuesChange = (d: Partial<Types.LiveTest>) => {
    const data = deepPatch(liveTest, d)
    props.saveLiveTest(data)
  }

  const generateWithAI = (fields: string[]) => {
    return (
      <GenerateWithAI
        courseId={liveTest._id + ''}
        fields={fields}
        onValuesChange={onValuesChange}
      />
    )
  }
  // const date = dayjs(Form.useWatch('scheduledAt', form))
  console.log(liveTest, 'date')
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      {/* <Form.Item name={['status']} required label="LiveTest Status">
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
      <Form.Item name="image" required label="Thumbnail">
        <MediaUpload
          source={{
            type: 'liveTest.image',
            value: liveTestId + ''
          }}
          uploadType="image"
          cropper
          aspect={16 / 9}
          name="image"
          width="200"
          height="300px"
          prefixKey={`liveTests/${liveTestId}/image`}
          renderItem={() => <Image preview={false} src={image} />}
          onUpload={e => {
            onValuesChange({ image: e.url })
          }}
        />
      </Form.Item>

      <Form.Item
        name="title"
        required
        label="Title"
        rules={[
          { required: true, message: 'Please enter a title for the liveTest' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="subtitle"
        required
        label="Subtitle"
        // rules={[{ required: true, message: 'Please enter a subtitle!' }]}
        extra={generateWithAI(['subtitle'])}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'description'}
        required
        label="Description"
        rules={[
          {
            required: true,
            message: 'Please enter a description for the liveTest'
          }
        ]}
        extra={generateWithAI(['description'])}
      >
        <TextArea rows={4} placeholder="Enter the liveTest description" />
      </Form.Item>
      <Row gutter={[40, 20]}>
        <Col span={12}>
          <Form.Item
            label="Duration(in minutes)"
            name={['duration']}
            rules={[{ required: true, message: 'Please select duration!' }]}
          >
            <Input type="number" placeholder="Enter duration in mins" />
          </Form.Item>
        </Col>
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
      </Row>
      <Row gutter={[40, 20]}>
        {/* <Col span={12}>
          <Row gutter={[0, 20]}>
            <Col flex={1}>
              <Form.Item
                name="instructor"
                required
                label="Instructor"
                rules={[
                  { required: true, message: 'Please select a instructor' }
                ]}
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Instructor"
                >
                  {instructors.map(instructor => {
                    return (
                      <Select.Option
                        key={instructor._id}
                        value={instructor._id}
                      >
                        <Space>
                          <Avatar size={20} src={instructor.image} />
                          <Typography.Text>{instructor.name}</Typography.Text>
                        </Space>
                      </Select.Option>
                    )
                  })}
                </Select>
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
                <AddInstructor> </AddInstructor>
              </ActionModal>
            </Col>
          </Row>
        </Col> */}
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
                name="scheduledAt"
                label="Scheduled For"
                required
              >
                <DatePicker showTime />
              </Form.Item>
            </Col>
            {/* <Col style={{ display: 'flex', alignItems: 'center' }}>
              <ActionModal
                cta={
                  <Button
                    style={{ marginLeft: 10 }}
                    shape="round"
                    icon={<PlusOutlined />}
                  />
                }
              >
                <CreateCategory> </CreateCategory>
              </ActionModal>
            </Col> */}
          </Row>
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
                <CreateCategory type="live-test"> </CreateCategory>
              </ActionModal>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

export default LiveTestDetailsEditor
