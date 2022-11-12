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

<Form.Item required label="Requirements">
          <QuillEditor value={props.formData.requirements} onChange={e => {
            console.log(e,'ee')
            props.onFormUpdate({ requirements: e })
          }} />
</Form.Item>
<Form.Item  required label="What you'll learn">
          <QuillEditor value={props.formData.whatYouLearn}  onChange={e => props.onFormUpdate({ whatYouLearn: e })} />
</Form.Item></Form>

   </Fragment>
  )
}

export default CourseDetailsEditor
