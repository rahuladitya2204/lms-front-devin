import {
  AutoComplete,
  Form,
  Input,
  Select,
} from 'antd';
import { Fragment, useEffect } from 'react'

import { Course } from '@Types/Courses.types';
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload';
import QuillEditor from '@Components/QuillEditor';
import { useGetCourseCategories } from '@User/Api/Course/queries';
import { useGetInstructors } from '@User/Api/Instructor/queries';

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
  formData: Partial<Course>;
  onFormUpdate: (d:Partial<Course>)=>void;
}

function CourseDetailsEditor(props:CourseDetailsEditorPropsI) {
  const [form] = Form.useForm<Course>();
  const { listItems: instructors, isLoading: loading } = useGetInstructors()
  const { listItems: categories } = useGetCourseCategories();
  console.log(categories, 'categories');
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
        <AutoComplete 
        options={categories}
        style={{ width: 200 }}
        onSelect={console.log}
        placeholder="Type Category"
          />
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
