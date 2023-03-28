import { Col, Form, Image, Input, Row, Typography } from 'antd'

import MediaUpload from '@Components/MediaUpload'
import { Store } from '@adewaskar/lms-common'
import { useFormik } from 'formik'

interface AppCustomizerScreenPropsI {}

const { Title } = Typography

const AppCustomizerScreen = (props: AppCustomizerScreenPropsI) => {
  const { organisation } = Store.useGlobal(s => s)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {}
  })
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Form>
              <Form.Item name="logo" required label="App Logo">
                <MediaUpload
                  url={'image'}
                  // rounded
                  width="100px"
                  renderItem={() => (
                    <Image preview={false} src={organisation.logo} />
                  )}
                  onUpload={e => {
                    // onFormUpdate({
                    //   logo: e.url
                    // })
                  }}
                />
              </Form.Item>
              <Form.Item name={'primaryColor'} label={'Primary Color'}>
                <Input placeholder="Select Primary color" type="color" />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AppCustomizerScreen
