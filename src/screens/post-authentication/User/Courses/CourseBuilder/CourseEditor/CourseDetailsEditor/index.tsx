import {
Form,
Image,
Input,
Select,
} from 'antd'
import { Fragment, useEffect } from 'react'

import { Course } from '../../../../../../../types/Courses.types';
import FormListItem from '../../../../../../../components/FormListItem';
import QuillEditor from '../../../../../../../components/QuillEditor';
import { useGetInstructors } from '../../../../../../../network/Instructor/queries';
import MediaUpload from '../../../../../../../components/MediaUpload';

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
          <MediaUpload url={thumbnailImage}
            renderItem={() => <Image src={thumbnailImage} />}
            onUpload={e => {
            props.onFormUpdate({
              thumbnailImage:e[0].url
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
