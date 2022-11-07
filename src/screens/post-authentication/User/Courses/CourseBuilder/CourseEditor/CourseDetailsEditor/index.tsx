import {
Form,
Image,
Input,
Select,
} from 'antd'
import { Fragment, useEffect } from 'react'

import { CourseDetailType } from '../../../../../../../types/Courses.types';
import FileUpload from '../../../../../../../components/FileUpload';
import FormListItem from '../../../../../../../components/FormListItem';
import QuillEditor from '../../../../../../../components/QuillEditor';
import { useGetInstructors } from '../../../../../../../network/Instructor/queries';

interface CourseDetailsEditorPropsI {
  formData: Partial<CourseDetailType>;
  onFormUpdate: (d:Partial<CourseDetailType>)=>void;
}

function CourseDetailsEditor(props:CourseDetailsEditorPropsI) {
  const [form] = Form.useForm<CourseDetailType>();
  const { listItems: instructors, isLoading: loading } = useGetInstructors()

  useEffect(() => {
    form.setFieldsValue(props.formData);
  },[props.formData])


  const thumbnailImage = form.getFieldValue('thumbnailImage') || "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";

  return (
    <Fragment>
       <Form onValuesChange={props.onFormUpdate} form={form} layout="vertical" autoComplete="off">
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


<FormListItem required name="requirements" placeholder='Enter Requirement' label='Course Requirements' />
<FormListItem required name="whatYouLearn" placeholder="What You'll Learn" label="What You'll Learn" />
</Form>

   </Fragment>
  )
}

export default CourseDetailsEditor
