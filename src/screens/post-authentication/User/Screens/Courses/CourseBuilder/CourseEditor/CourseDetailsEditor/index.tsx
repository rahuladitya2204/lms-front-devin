import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography
} from 'antd'
import { useEffect } from 'react'

import ActionModal from '@Components/ActionModal'
import AddInstructor from '@User/Screens/Users/Instructors/AddInstructor'
import CreateCategory from '@User/Screens/Courses/CourseCategory/CreateCategory'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import { Constants, Types } from '@adewaskar/lms-common'
import { User, Utils } from '@adewaskar/lms-common'
import { deepPatch } from '../../utils'
import { useParams } from 'react-router'

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
  const [form] = Form.useForm()
  const { id } = useParams()
  const courseId = props.courseId || id
  const { data: instructors } = User.Queries.useGetInstructors()
  const { listItems: categories } = User.Queries.useGetCourseCategories()
  const thumbnailImage = useWatch(['thumbnailImage'], form)
  useEffect(
    () => {
      form.setFieldsValue(props.course)
    },
    [props.course]
  )

  const onValuesChange = (d: Partial<Types.Course>) => {
    const data = deepPatch(props.course, d)
    props.saveCourse(data)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      <Form.Item name={['status']} required label="Course Status">
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
      </Form.Item>
      <Form.Item name="thumbnailImage" required label="Thumbnail">
        <MediaUpload
          uploadType="image"
          cropper
          name="thumbnailImage"
          width="250px"
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
      <Form.Item name="subtitle" required label="Subtitle">
        <Input />
      </Form.Item>
      <Row>
        <Col span={8}>
          <Space>
            <Form.Item name={['category']} required label="Category">
              <Select style={{ width: 200 }} placeholder="Select Category">
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
          </Space>
        </Col>
        <Col span={8}>
          <Space>
            <Form.Item name="instructor" required label="Instructor">
              <Select placeholder="Select Instructor" style={{ width: 200 }}>
                {instructors.map(instructor => {
                  return (
                    <Select.Option key={instructor._id} value={instructor._id}>
                      <Space>
                        <Avatar size={30} src={instructor.image} />
                        <Typography.Text>{instructor.name}</Typography.Text>
                      </Space>
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
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
          </Space>
        </Col>
        <Col span={8}>
          <Form.Item name="language" required label="Language">
            <Select
              showSearch
              placeholder="Select Language"
              options={LANGUAGES}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default CourseDetailsEditor
