import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,

} from 'antd'
import { Fragment, useEffect, useState } from 'react'

import { Constants, Types } from '@adewaskar/lms-common'
import { PlusCircleFilled } from '@ant-design/icons';


interface CreateQuestionFormPropsI {
    saveQuestion?: (d: Types.CourseQuizQuestion) => void;
  question?: Types.CourseQuizQuestion;
  closeModal?: Function;
}

const CreateQuestionForm: React.FC<CreateQuestionFormPropsI> = props => {
  const [form] = Form.useForm()
  const [correctOptions, setCorrectOptions] = useState<number[]>([]);
  useEffect(
    () => {
      if (props.question) {
        setCorrectOptions(props.question.correctOptions);
          form.setFieldsValue(props.question);
      }
          else
      {
        form.setFieldsValue(Constants.INITIAL_COURSE_QUESTION);
    }
    },
    [props.question]
  ) 
    const saveQuestion = (e: Types.CourseQuizQuestion) => {
      props.saveQuestion && props.saveQuestion({ ...e, correctOptions });
      props.closeModal && props.closeModal();
    }
  
  const questionType = Form.useWatch('type', form);
  const OptionSelectedFormControl = questionType === 'single' ? Radio : Checkbox;

  return (
    <Fragment>
      <Form name='quiz' onFinish={saveQuestion}
        form={form}
        layout="vertical"
      >
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Enter the question title" />
        </Form.Item>
        <Form.Item label='Question Type' name={'type'}>
        <Select
      style={{ width: 240 }}
      options={[
        { value: 'single', label: 'Single Choice' },
        { value: 'multiple', label: 'Multiple' },
        { value: 'subjective', label: 'Subjective' },
      ]}
    />

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
                    <Input placeholder={`Answer ${index + 1}`}/> 
                  </Form.Item>
                </Col>
                <Col>

                  {/* @ts-ignore */}
                    <OptionSelectedFormControl
                      checked={correctOptions.indexOf(index) > -1}
                      onChange={e => {
                      let options=[...correctOptions]
                      const indexOfOption=options.indexOf(index);
                      if (e.target.checked) {
                        if (indexOfOption === -1) {
                          if (questionType === 'single') {
                            options = [index];
                          }
                          else
                          {
                            options.push(index)
                          }
                        }
                      }
                      else
                      {
                        options.splice(indexOfOption, 1);
                      }
                      setCorrectOptions(options)
                    }}
                    style={{ marginLeft: 20 }} />
                </Col>
             </Row>

            ))}
                    <Button icon={<PlusCircleFilled/>}>Add Option</Button>
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
