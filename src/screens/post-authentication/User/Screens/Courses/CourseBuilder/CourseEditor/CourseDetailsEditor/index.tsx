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
import { Fragment, useEffect } from 'react'
import {
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
  UserOutlined
} from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddInstructor from '@User/Screens/Users/Instructors/AddInstructor'
import CreateCategory from '@User/Screens/Courses/CourseCategory/CreateCategory'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import QuillEditor from '@Components/QuillEditor'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
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

const { Option } = Select
interface CourseDetailsEditorPropsI {
  formData: Partial<Types.Course>;
  onFormUpdate: (d: Partial<Types.Course>) => void;
}

function CourseDetailsEditor(props: CourseDetailsEditorPropsI) {
  const { id: courseId } = useParams()
  const {
    data: instructors,
    isLoading: loading
  } = User.Queries.useGetInstructors()
  const { listItems: categories } = User.Queries.useGetCourseCategories()

  // useEffect(() => {
  //   form.setFieldsValue(props.formData);
  // },[props.formData])

  const thumbnailImage = props.formData.thumbnailImage
  console.log(props.formData, 'ddd')
  return (
    <Fragment>
      <Form.Item name="thumbnailImage" required label="Thumbnail">
        <MediaUpload
          uploadType="image"
          cropper
          width="250px"
          prefixKey={`courses/${courseId}/thumbnailImage`}
          renderItem={() => <Image preview={false} src={thumbnailImage} />}
          onUpload={e => {
            props.onFormUpdate({
              thumbnailImage: e.url
            })
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
          <Form.Item name={['category']} required label="Category">
            <Select
              style={{ width: 200 }}
              placeholder="Select Category"
              optionLabelProp="label"
            >
              {categories.map(category => {
                return (
                  <Option value={category.value} label={category.label}>
                    {category.label}
                  </Option>
                )
              })}
            </Select>
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
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="instructor" required label="Instructor">
            <Space>
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
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="language" required label="Language">
            <Select
              showSearch
              placeholder="Select Language"
              optionFilterProp="children"
              options={LANGUAGES}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* <Form.Item required label="Requirements" name='requirements'>
          <QuillEditor onChange={e => {
            props.onFormUpdate({ requirements: e })
          }} />
</Form.Item>
<Form.Item  required label="What you'll learn" name={'whatYouLearn'}>
          <QuillEditor  onChange={e => props.onFormUpdate({ whatYouLearn: e })} />
        </Form.Item> */}
      <Form.Item name="description" required label="Description">
        <QuillEditor value="" />
      </Form.Item>
    </Fragment>
  )
}

export default CourseDetailsEditor
