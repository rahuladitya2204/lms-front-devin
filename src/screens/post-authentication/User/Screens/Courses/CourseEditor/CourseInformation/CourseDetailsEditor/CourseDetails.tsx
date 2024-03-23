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
} from 'antd'
import { Constants, Types } from '@invinciblezealorg/lms-common'
import { User, Utils } from '@invinciblezealorg/lms-common'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddUser from '@User/Screens/Users/Users/AddUser'
import CreateCategory from '@User/Screens/Categories/CreateCategory'
import GenerateWithAI from '../GenerateWithAiButton'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import SelectProductCategory from '@Components/SelectProductCategory'
import { Typography } from '@Components/Typography'
import { deepPatch } from '../../CourseBuilder/utils'
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
  const { data: users } = User.Queries.useGetUsers()
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
        courseId={course._id}
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
          cropper={{width:330,height:200}}
          aspect={16 / 9}
          name="thumbnailImage"
          width="200px"
          height="300px"
          prefixKey={`courses/${courseId}/thumbnailImage`}
          renderItem={() => <Image preview={false} src={thumbnailImage} />}
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
          { required: true, message: 'Please enter a title for the course' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="subtitle"
        required
        label="Subtitle"
        rules={[{ required: true, message: 'Please enter a subtitle!' }]}
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
            message: 'Please enter a description for the course'
          }
        ]}
        extra={generateWithAI(['description'])}
      >
        <TextArea rows={4} placeholder="Enter the course description" />
      </Form.Item>
      <Row gutter={[40, 20]}>
        <Col span={12}>
          <Form.Item
            label="Difficulty Level"
            name={['difficultyLevel']}
            rules={[
              { required: true, message: 'Please select difficulty level!' }
            ]}
          >
            <Select options={DIFFICULTY_LEVELS} />
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
              options={Constants.LANGUAGES}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[40, 20]}>
        <Col span={12}>
          <Row gutter={[0, 20]}>
            <Col flex={1}>
              <Form.Item
                name="user"
                required
                label="User"
                rules={[
                  { required: true, message: 'Please select a user' }
                ]}
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select User"
                >
                  {users.map(user => {
                    return (
                      <Select.Option
                        key={user._id}
                        value={user._id}
                      >
                        <Space>
                          <Avatar size={20} src={user.image} />
                          <Typography.Text>{user.name}</Typography.Text>
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
                <AddUser> </AddUser>
              </ActionModal>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <SelectProductCategory name={['category']} />
        </Col>
      </Row>
    </Form>
  )
}

export default CourseDetailsEditor
