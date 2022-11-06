import {
  Button,
  Form,
  Image,
  Input,
  Space,
} from 'antd'
import { Fragment, useEffect } from 'react'
import {
useGetCourseDetails,
useUpdateCourse
} from '../../../../queries/Courses/CoursesQueries'

import { CourseDetailsType } from '../../../../types/Courses.types'
import FileUpload from '../../../../components/FileUpload'
import FormListItem from '../../../../components/FormListItem'
import QuillEditor from '../../../../components/QuillEditor'
import { useParams } from 'react-router'

function CourseDetailsEditor() {
  const [form] = Form.useForm<CourseDetailsType>();
  const { id: courseId } = useParams()
  const { mutate: updateCourse, isLoading: loading } = useUpdateCourse()
  const { data: courseDetails } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  useEffect(() => {
    form.setFieldsValue(courseDetails);
  },[courseDetails])


  const onSubmit = (e:any) => {
    console.log(e)
    updateCourse({
      id: courseId+'',
      data:e
    })
  }

  const thumbnailImage = form.getFieldValue('thumbnailImage') || "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";
  console.log(thumbnailImage,'thumbnailImage')
  return (
    <Fragment>
       <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off">

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

<Space align='end'>

  <Button loading={loading} type="primary" htmlType="submit">
    Save
  </Button>

</Space>
   </Fragment>
  )
}

export default CourseDetailsEditor
