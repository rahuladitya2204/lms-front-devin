import {
  Button,
  Form,
  Input,
} from 'antd'
import { Fragment, useEffect } from 'react'

import MediaPlayer from '@Components/MediaPlayer';
import MediaUpload from '@Components/MediaUpload';
import QuillEditor from '@Components/QuillEditor';
import { Types } from '@adewaskar/lms-common'
import { useParams } from 'react-router';

interface CourseLandingPageEditorPropsI {
    courseId: string;
    }
    
function CourseLandingPageEditor(props: CourseLandingPageEditorPropsI) {
  const { id } = useParams();
  const courseId = props.courseId || id;
  const form = Form.useFormInstance<Types.CourseLandingPage>();    
  const { useWatch} = Form;
  const promoVideoUrl = useWatch(['promoVideo'], form)

      return (
        <Fragment>
              <Form.Item  name={['landingPage','description']} required label="Description">
        <QuillEditor  name={['landingPage','description']} value="" />
      </Form.Item>
            <Form.Item name="promoVideo" label="Promo Video" required>
              <MediaUpload
                prefixKey={`courses/${courseId}/promo`}
              width="300px"
              name="promoVideo"
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
    