import { Checkbox, Col, Form, Image, Input, Row, Typography } from 'antd'

import ImageUpload from '@Components/ImageUpload'
import MediaUpload from '@Components/MediaUpload'
import { Store } from '@adewaskar/lms-common'
import { generate } from '@ant-design/colors'
import { useFormik } from 'formik'
import useGetPalette from '@Hooks/useGetPalette'

interface AppCustomizerScreenPropsI {}

const AppCustomizerScreen = (props: AppCustomizerScreenPropsI) => {
  const { organisation } = Store.useGlobal(s => s)
  const { color } = useGetPalette()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {}
  })
  const colors = generate('#1890ff', {
    theme: 'dark',
    backgroundColor: '#141414'
  })
  // useEff
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Form layout="vertical">
              <Form.Item name="logo" required label="App Logo">
                <MediaUpload
                  cropper
                  uploadType={'image'}
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
                {color.map(c => (
                  <Checkbox onChange={formik.handleChange}>
                    <Input
                      style={{ width: 60, height: 50, marginRight: 10 }}
                      value={c}
                      placeholder="Select Primary color"
                      type="color"
                    />
                  </Checkbox>
                ))}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AppCustomizerScreen
