import { Button, Card, Empty, Form } from 'antd'

import { Fragment } from 'react'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import TextArea from '@Components/Textarea'

interface PackageLandingPageEditorPropsI {
  packageId: string;
}

export default function PackageLandingPageEditor(
  props: PackageLandingPageEditorPropsI
) {
  const form = Form.useFormInstance()
  const promoVideoFile = Form.useWatch(['landingPage'], form)
  const { packageId } = props
  return (
    <Fragment>
      <Card
        style={{ marginTop: 20, marginBottom: 20 }}
        title="Promo Video"
        extra={[
          <MediaUpload
            source={{
              type: 'package.promoVideo',
              value: packageId + ''
            }}
            prefixKey={`courses/${packageId}/promo`}
            width="300px"
            name={['landingPage', 'promoVideo']}
            height="250px"
            onUpload={d => {
              console.log(d, 'eee')
              form.setFieldValue(['landingPage', 'promoVideo'], {
                file: d._id,
                url: d.url
              })
            }}
            renderItem={() => (
              <Button>
                {promoVideoFile?.url
                  ? 'Replace Promo Video'
                  : 'Upload Promo Video'}
              </Button>
            )}
            // url={promoVideoFile}
          />
        ]}
      >
        {promoVideoFile?.url ? (
          <MediaPlayer width={500} height={300} fileId={promoVideoFile?.url} />
        ) : (
          <Empty description="Np promo video added" />
        )}
      </Card>

      <Form.Item
        name={['landingPage', 'description']}
        required
        label="Landing Page Description"
      >
        <TextArea html={{ level: 3 }} name={'description'} />
      </Form.Item>
    </Fragment>
  )
}
