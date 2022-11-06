import {
  Form,
  Image,
  Input,
} from 'antd'
import { Fragment, useEffect } from 'react'

import { CourseDetailsType } from '../../../../types/Courses.types'
import FileUpload from '../../../../components/FileUpload'
import FormListItem from '../../../../components/FormListItem'
import QuillEditor from '../../../../components/QuillEditor'

interface CourseDetailsEditorI {
  formData: Partial<CourseDetailsType>;
  onFormUpdate: (data: Partial<CourseDetailsType>) => void;
}

function CourseDetailsEditor(props:CourseDetailsEditorI) {
  const [form] = Form.useForm<CourseDetailsType>();
  useEffect(() => {
    form.setFieldsValue(props.formData);
  },[props.formData])


  const thumbnailImage = form.getFieldValue('thumbnailImage') || "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";

  return (
    <Fragment>
       <Form onValuesChange={e=>console.log(e,'eeee')} form={form} layout="vertical" autoComplete="off">

<Form.Item name="thumbnailImage" required label="Thumbnail">
  <FileUpload onUpload={e => {
    form.setFieldValue('thumbnailImage', e[0].url);
  }}>
  <Image preview={false}
      width={200}
      fallback={"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"}
src={thumbnailImage}
/>
</FileUpload>
</Form.Item>

<Form.Item name="title" required label="Course Title">
  <Input />
</Form.Item>

<Form.Item name="description" required label="Course Description">
  <QuillEditor value=''/>
</Form.Item>


<Form.Item name="instructorName" required label="Instructor">
<Input />
</Form.Item>


<FormListItem required name="requirements" placeholder='Enter Requirement' label='Course Requirements' />
<FormListItem required name="whatYouLearn" placeholder="What You'll Learn" label="What You'll Learn" />
</Form>
   </Fragment>
  )
}

export default CourseDetailsEditor
