import {
  Button,
  Form,
  Input,
} from 'antd'
import { Fragment, useEffect } from 'react'

import MediaPlayer from '@Components/MediaPlayer';
import MediaUpload from '@Components/MediaUpload';
import { Types } from '@adewaskar/lms-common'

interface CourseLandingPageEditorPropsI {
    courseId: string;
    }
    
function CourseLandingPageEditor(props: CourseLandingPageEditorPropsI) {
  const { courseId } = props;
  const [form] = Form.useForm<Types.CourseLandingPage>();    
  const { useWatch} = Form;
  const promoVideoUrl = useWatch(['promoVideo'], form)

      return (
        <Fragment>

           <Form.Item  name='url' required label="Landing Page URL">
<Input       addonBefore="extremebi://"/>
            </Form.Item>
           <Form.Item name={['landingPage','description']} required label="Description">
<Input/>
            </Form.Item>
            
            <Form.Item label="Promo Video" required>
              <MediaUpload
                prefixKey={`courses/${courseId}/promo`}
            width="300px"
            onUpload={({ url }) => {
              form.setFieldValue('promoVideo', url)
            }}
            height="250px"
            renderItem={() => (
              <Button>{promoVideoUrl ? 'Replace Video' : 'Upload Video'}</Button>
            )}
            // url={promoVideoUrl}
          />
          {promoVideoUrl ? <MediaPlayer url={promoVideoUrl} /> : null}
        </Form.Item>

              </Fragment >)
        
    }
    
    export default CourseLandingPageEditor
    