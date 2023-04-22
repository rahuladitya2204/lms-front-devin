import { Button, Form, Input } from 'antd'
import { Fragment, useEffect, useLayoutEffect } from 'react'
import { Types, User } from '@adewaskar/lms-common'

import HtmlEditor from '@Components/HtmlEditor'
import MediaPlayer from '@Components/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import { deepPatch } from '../../utils'
// import { patchObject } from '../../utils'
import { useParams } from 'react-router'

interface CourseLandingPageEditorPropsI {
  courseId: string;
  saveCourse: Function;

  course: Types.Course;
}

function CourseLandingPageEditor(props: CourseLandingPageEditorPropsI) {
  const { id } = useParams()
  const { course } = props
  const courseId = props.courseId || id + ''
  const [form] = Form.useForm()
  const { useWatch } = Form
  const promoVideoFile = useWatch(['promoVideo'], form)
  useLayoutEffect(
    () => {
      form.setFieldsValue(course.landingPage)
    },
    [course]
  )

  return (
    <Form
      onValuesChange={d => {
        const data = deepPatch(course.landingPage, d)
        console.log(data, d, 1111)
        props.saveCourse({
          landingPage: data
        })
      }}
      form={form}
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item name={'description'} required label="Description">
        <SunEditorComponent name={'description'} />
      </Form.Item>
      <Form.Item name="promoVideo" label="Promo Video" required>
        <MediaUpload
          prefixKey={`courses/${courseId}/promo`}
          width="300px"
          name="promoVideo"
          height="250px"
          onUpload={d => {
            console.log(d, 'eee')
            form.setFieldValue('promoVideo', d._id)
          }}
          renderItem={() => (
            <Button>{promoVideoFile ? 'Replace Video' : 'Upload Video'}</Button>
          )}
          // url={promoVideoFile}
        />
        {promoVideoFile ? <MediaPlayer fileId={promoVideoFile} /> : null}
      </Form.Item>
      {/* <Button onClick={form.submit}>HSSHSHH</Button> */}
    </Form>
  )
}

export default CourseLandingPageEditor
