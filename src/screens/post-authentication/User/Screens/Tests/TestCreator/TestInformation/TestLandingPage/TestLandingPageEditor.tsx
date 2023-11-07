import { Button, Card, Empty, Form, Input } from 'antd'

import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import TextArea from '@Components/Textarea'
// 
import { Types } from '@adewaskar/lms-common'
import { deepPatch } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useLayoutEffect } from 'react'
// import { patchObject } from '../../utils'
import { useParams } from 'react-router'

interface TestLandingPageEditorPropsI {
  testId: string;
  saveTest: Function;

  test: Types.Test;
}

function TestLandingPageEditor(props: TestLandingPageEditorPropsI) {
  const { id } = useParams()
  const { test } = props
  const testId = props.testId || id + ''
  const [form] = Form.useForm()
  const promoVideoFile = test.landingPage.promoVideo
  useLayoutEffect(
    () => {
      form.setFieldsValue(test.landingPage)
    },
    [test]
  )

  const onValuesChange = (d: Partial<Types.TestLandingPage>) => {
    const data = deepPatch(test.landingPage, d)
    props.saveTest({
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
              type: 'test.promoVideo',
              value: testId + ''
            }}
            prefixKey={`Tests/${testId}/promo`}
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
        <TextArea html name={'description'} />
      </Form.Item>
    </Form>
  )
}

export default TestLandingPageEditor
