import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography
} from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { User, Utils } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal'
import AddInstructor from '@User/Screens/Users/Instructors/AddInstructor'
import CreateCategory from '@User/Screens/Courses/CourseCategory/CreateCategory'
import GenerateWithAI from '../GenerateWithAiButton'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import { deepPatch } from '../../utils'
import { useEffect } from 'react'
import { useParams } from 'react-router'

const { TextArea } = Input
const { Text } = Typography

const DIFFICULTY_LEVELS = [
  {
    label: 'Beginner',
    value: 'beginner'
  },
  {
    label: 'Intermediate',
    value: 'intermediate'
  },
  {
    label: 'Advanced',
    value: 'advanced'
  }
]

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
const { Option } = Select
interface CourseDetailsEditorPropsI {
  courseId?: string;
  saveCourse: Function;
  course: Types.Course;
}

const STATUSES = Utils.getValuesFromMap(Constants.COURSE_STATUSES_MAP)

function CourseDetailsEditor(props: CourseDetailsEditorPropsI) {
  const { course } = props
  const [form] = Form.useForm()
  const { id } = useParams()
  const courseId = props.courseId || id
  const { data: instructors } = User.Queries.useGetInstructors()
  const { listItems: categories } = User.Queries.useGetCourseCategories()
  const thumbnailImage = useWatch(['thumbnailImage'], form)
  useEffect(
    () => {
      form.setFieldsValue(course)
    },
    [course]
  )

  const onValuesChange = (d: Partial<Types.Course>) => {
    const data = deepPatch(course, d)
    props.saveCourse(data)
  }

  const generateWithAI = (fields: string[]) => {
    return (
      <GenerateWithAI
        course={course}
        fields={fields}
        onValuesChange={onValuesChange}
      />
    )
  }

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      {/* <Form.Item name={['status']} required label="Course Status">
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
            type: 'course.thumbnailImage',
            value: courseId + ''
          }}
          uploadType="image"
          cropper
          aspect={16 / 9}
          name="thumbnailImage"
          width="200"
          height="300px"
          prefixKey={`courses/${courseId}/thumbnailImage`}
          renderItem={() => <Image preview={false} src={thumbnailImage} />}
          onUpload={e => {
            onValuesChange({ thumbnailImage: e.url })
          }}
        />
      </Form.Item>

      <Form.Item name="title" required label="Title">
        <Input />
      </Form.Item>

      <Form.Item
        name="subtitle"
        required
        label="Subtitle"
        extra={generateWithAI(['subtitle'])}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'description'}
        required
        label="Description"
        extra={generateWithAI(['description'])}
      >
        <TextArea rows={4} placeholder="Enter the course description" />
      </Form.Item>
      <Row gutter={[40, 20]}>
        <Col span={12}>
          <Form.Item label="Difficulty Level" name={['difficultyLevel']}>
            <Select options={DIFFICULTY_LEVELS} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="language" required label="Language">
            <Select
              showSearch
              placeholder="Select Language"
              options={LANGUAGES}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[40, 20]}>
        <Col span={12}>
          <Row gutter={[0, 20]}>
            <Col flex={1}>
              <Form.Item name="instructor" required label="Instructor">
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
        </Col>
        <Col span={12}>
          <Row gutter={[0, 20]} justify={'end'}>
            <Col flex={1}>
              <Form.Item name={['category']} required label="Category">
                <Select style={{ width: '100%' }} placeholder="Select Category">
                  {categories.map(category => {
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
                <CreateCategory> </CreateCategory>
              </ActionModal>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

export default CourseDetailsEditor
