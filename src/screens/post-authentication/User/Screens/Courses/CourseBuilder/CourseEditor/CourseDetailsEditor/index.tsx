import {
Form,
Image,
Input,
Select,
} from 'antd'
import { Fragment, useEffect } from 'react'
import FormListItem from '@Components/FormListItem';
import MediaUpload from '@Components/MediaUpload';
import QuillEditor from '@Components/QuillEditor';
import { Course } from '@Types/Courses.types';
import { useGetInstructors } from '@User/Api/queries';


interface CourseDetailsEditorPropsI {
  formData: Partial<Course>;
  onFormUpdate: (d:Partial<Course>)=>void;
}

function CourseDetailsEditor(props:CourseDetailsEditorPropsI) {
  const [form] = Form.useForm<Course>();
  const { listItems: instructors, isLoading: loading } = useGetInstructors()

  useEffect(() => {
    form.setFieldsValue(props.formData);
  },[props.formData])


  const thumbnailImage = props.formData.thumbnailImage;

  return (
    <Fragment>
       <Form onValuesChange={props.onFormUpdate} form={form} layout="vertical" autoComplete="off">
<Form.Item name="thumbnailImage" required label="Thumbnail">
          <MediaUpload url={thumbnailImage} width='100px'
            renderItem={() => <Image src={thumbnailImage} />}
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

<Form.Item name="description" required label="Description">
  <QuillEditor value=''/>
</Form.Item>


<Form.Item name="instructor" required label="Instructor">
<Select
    showSearch
    placeholder="Select Instructor"
    optionFilterProp="children"
    filterOption={(input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
    options={instructors}
  />
</Form.Item>


<FormListItem name="requirements"  placeholder='Enter Requirement' label='Course Requirements' />
<FormListItem name="whatYouLearn" placeholder="What You'll Learn" label="What You'll Learn" />
</Form>

   </Fragment>
  )
}

export default CourseDetailsEditor
