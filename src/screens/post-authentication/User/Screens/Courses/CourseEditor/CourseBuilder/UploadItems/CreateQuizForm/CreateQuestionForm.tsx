import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,

} from 'antd'
import { Fragment, useEffect } from 'react'

import { Constants, Types } from '@adewaskar/lms-common'


interface CreateQuestionFormPropsI {
    saveQuestion?: (d: Types.CourseQuestion) => void;
  question?: Types.CourseQuestion;
  closeModal?: Function;
}

const CreateQuestionForm: React.FC<CreateQuestionFormPropsI> = props => {
  const [form] = Form.useForm()

  useEffect(
    () => {
      if (props.question) {
          form.setFieldsValue(props.question);
      }
          else
      {
        form.setFieldsValue(Constants.INITIAL_COURSE_QUESTION);
    }
    },
    [props.question]
  )
    
    const saveQuestion = (e: Types.CourseQuestion) => {
      console.log(e, 'eee');
        props.saveQuestion && props.saveQuestion(e);
      props.closeModal && props.closeModal();
  }

  return (
    <Fragment>
      <Form name='quiz' onFinish={saveQuestion}
        form={form}
        layout="vertical"
      >
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Enter the question title" />
        </Form.Item>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card style={{ marginBottom: 20 }} title="Answers">
            <Form.List name="answers">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
             <Row justify={'center'}>
                    <Col flex={1}>
                    <Form.Item 
                rules={[
                  { required: true, message: 'Please enter the answer.' },
                ]}
                            {...field}
                
                >
 {/* @ts-ignore */}
                    <Input placeholder={`Answer ${index + 1}`}/> 
                        </Form.Item>  </Col>
                    <Col>
                  <Checkbox onChange={e => {

                        }} style={{marginLeft:20}} /></Col>
             </Row>

            ))}
          </>
        )}
      </Form.List>
            </Card>
          </Col>
              </Row>
              <Button onClick={form.submit} type='primary'>
                Save Question
              </Button>
      </Form>
    </Fragment>
  )
}

export default CreateQuestionForm
