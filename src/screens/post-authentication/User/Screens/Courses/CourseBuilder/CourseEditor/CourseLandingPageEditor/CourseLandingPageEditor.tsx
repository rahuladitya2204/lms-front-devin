import { Button, Card, Empty, Form, Input } from 'antd'
import { Fragment, useEffect, useLayoutEffect } from 'react'
import { Types, User } from '@adewaskar/lms-common'

import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
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
  const promoVideoFile = course.landingPage.promoVideo
  useLayoutEffect(
    () => {
      form.setFieldsValue(course.landingPage)
    },
    [course]
  )

  const onValuesChange = (d: Partial<Types.CourseLandingPage>) => {
    const data = deepPatch(course.landingPage, d)
    props.saveCourse({
      landingPage: data
    })
  }
  return (
    <Form
      onValuesChange={onValuesChange}
      form={form}
      layout="vertical"
      autoComplete="off"
    >
      <Card
        style={{ marginTop: 20, marginBottom: 20 }}
        title="Promo Video"
        extra={[
          <MediaUpload
            source={{
              type: 'course.promoVideo',
              value: courseId + ''
            }}
            prefixKey={`courses/${courseId}/promo`}
            width="300px"
            name="promoVideo"
            height="250px"
            onUpload={d => {
              console.log(d, 'eee')
              onValuesChange({
                promoVideo: d._id
              })
            }}
            renderItem={() => (
              <Button>
                {promoVideoFile ? 'Replace Promo Video' : 'Upload Promo Video'}
              </Button>
            )}
            // url={promoVideoFile}
          />
        ]}
      >
        {promoVideoFile ? (
          <MediaPlayer width={500} height={300} fileId={promoVideoFile} />
        ) : (
          <Empty description="Np promo video added" />
        )}
      </Card>

      <Form.Item name={'description'} required label="Landing Page Description">
        <SunEditorComponent name={'description'} />
      </Form.Item>
    </Form>
  )
}

export default CourseLandingPageEditor
