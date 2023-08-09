import { Button, Card, Empty, Form, Input } from 'antd'
import { useLayoutEffect } from 'react'
import { Types } from '@adewaskar/lms-common'

import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
// import { patchObject } from '../../utils'
import { useParams } from 'react-router'
import { deepPatch } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'

interface LiveTestLandingPageEditorPropsI {
  liveTestId: string;
  saveLiveTest: Function;

  liveTest: Types.LiveTest;
}

function LiveTestLandingPageEditor(props: LiveTestLandingPageEditorPropsI) {
  const { id } = useParams()
  const { liveTest } = props
  const liveTestId = props.liveTestId || id + ''
  const [form] = Form.useForm()
  const promoVideoFile = liveTest.landingPage.promoVideo
  useLayoutEffect(
    () => {
      form.setFieldsValue(liveTest.landingPage)
    },
    [liveTest]
  )

  const onValuesChange = (d: Partial<Types.LiveTestLandingPage>) => {
    const data = deepPatch(liveTest.landingPage, d)
    props.saveLiveTest({
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
              type: 'liveTest.promoVideo',
              value: liveTestId + ''
            }}
            prefixKey={`liveTests/${liveTestId}/promo`}
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

export default LiveTestLandingPageEditor
