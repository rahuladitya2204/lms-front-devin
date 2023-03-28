import {
  AutoComplete,
  Avatar,
  Button,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from 'antd';
import { Fragment, useEffect } from 'react'
import { PlusCircleFilled, PlusCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';

import ActionModal from '@Components/ActionModal';
import AddInstructor from '@User/Screens/Users/Instructors/AddInstructor';
import CreateCategory from '@User/Screens/Courses/CourseCategory/CreateCategory';
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload';
import QuillEditor from '@Components/QuillEditor';
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common';

const LANGUAGES = [
  {
    value: 'english',
    label:'English',
  },
  {
    value: 'hindi',
    label:'Hindi',
  }
]

interface CourseDetailsEditorPropsI {
  formData: Partial<Types.Course>;
  onFormUpdate: (d:Partial<Types.Course>)=>void;
}

function CourseDetailsEditor(props:CourseDetailsEditorPropsI) {
  const [form] = Form.useForm<Types.Course>();
  const { data: instructors, isLoading: loading } = User.Queries.useGetInstructors()
  const { listItems: categories } = User.Queries.useGetCourseCategories();

  useEffect(() => {
    form.setFieldsValue(props.formData);
  },[props.formData])


  const thumbnailImage = props.formData.thumbnailImage;

  return (
    <Fragment>
       <Form onValuesChange={props.onFormUpdate} form={form} layout="vertical" autoComplete="off">
<Form.Item name="thumbnailImage" required label="Thumbnail">
          <MediaUpload url={thumbnailImage} width='250px'
            renderItem={() => <Image preview={false} src={thumbnailImage} />}
            onUpload={e => {
            props.onFormUpdate({
              thumbnailImage:e.url
            })

  }} />

</Form.Item>

<Form.Item name="title" required label="Title">
  <Input />
        </Form.Item>
        <Form.Item name="subtitle" required label="Subtitle">
  <Input />
</Form.Item>
        <Form.Item name="category" required label="Category">
          <Space>
          <Select
    placeholder="Select Category" style={{width:200}}
    optionFilterProp="children"
    filterOption={(input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
    options={categories}
  />
          <ActionModal
            cta={<Button style={{ marginLeft:10}} shape='round' icon={<PlusOutlined />}></Button>}
          >
            <CreateCategory> </CreateCategory>
            </ActionModal>
            </Space>

  </Form.Item>


<Form.Item name="instructor" required label="Instructor">
          <Space>
          <Select
            // showSearch
            // filterOption={(input, option) =>
            //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            // }
    placeholder="Select Instructor"
            optionFilterProp="children"
            style={{height: 60,width: 300}}

          >
            {instructors.map(instructor=>{
              return  <Select.Option value={instructor._id}>
              <Space>
                    <Avatar size={30} src={instructor.image} />
                    <Typography.Text>{ instructor.name}</Typography.Text>
                  </Space>
                </Select.Option>
            })}
            </Select>
            <ActionModal
            cta={<Button style={{ marginLeft:10}} shape='round' icon={<PlusOutlined />}></Button>}
          >
            <AddInstructor> </AddInstructor>
            </ActionModal>
</Space>
        </Form.Item>
        
        <Form.Item name="language" required label="Language">
<Select
    showSearch
    placeholder="Select Language"
    optionFilterProp="children"
    options={LANGUAGES}
  />
</Form.Item>

{/* <Form.Item required label="Requirements" name='requirements'>
          <QuillEditor onChange={e => {
            props.onFormUpdate({ requirements: e })
          }} />
</Form.Item>
<Form.Item  required label="What you'll learn" name={'whatYouLearn'}>
          <QuillEditor  onChange={e => props.onFormUpdate({ whatYouLearn: e })} />
        </Form.Item> */}
        <Form.Item name="description" required label="Description">
  <QuillEditor value=''/>
        </Form.Item>
</Form>

   </Fragment>
  )
}

export default CourseDetailsEditor
