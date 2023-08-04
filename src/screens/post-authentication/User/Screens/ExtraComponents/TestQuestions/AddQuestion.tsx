import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,

} from 'antd'
import { Fragment, useEffect, useState } from 'react'

import { Constants, Types } from '@adewaskar/lms-common'
import {  DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';

const { confirm } = Modal;

export const QUESTION_TYPES=[
  { value: 'single', label: 'Single Choice' },
  { value: 'multiple', label: 'Multiple Choice' },
  { value: 'subjective', label: 'Subjective' },
];
interface CreateQuestionFormPropsI {
  submit?: (d: Types.CourseQuizQuestion) => void;
  data?: Types.CourseQuizQuestion;
  closeModal?: Function;
}


const AddQuestion: React.FC<CreateQuestionFormPropsI> = props => {
  const [form] = Form.useForm()
  const [correctOptions, setCorrectOptions] = useState<number[]>([]);
  useEffect(
    () => {
      if (props.data) {
        setCorrectOptions(props.data.correctOptions);
          form.setFieldsValue(props.data);
      }
          else
      {
        form.setFieldsValue(Constants.INITIAL_COURSE_QUESTION);
    }
    },
    [props.data]
  ) 
    const submit = (e: Types.CourseQuizQuestion) => {
      props.submit && props.submit({ ...e, correctOptions });
      props.closeModal && props.closeModal();
    }
  
  const questionType = Form.useWatch('type', form);
  const OptionSelectedFormControl = questionType === 'single' ? Radio : Checkbox;

  return (
    <Fragment>
      <Form name='quiz' onFinish={submit}
        form={form}
        layout="vertical"
      >
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Enter the question title" />
        </Form.Item>
        <Form.Item label='Question Type' name={'type'}>
        <Select
      style={{ width: 240 }}
      options={QUESTION_TYPES}
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
                  
                  <DeleteTwoTone onClick={e => {
                    confirm({
                      title: 'Are you sure?',
                      content: `You want to delete this answer`,
                      onOk() {
                        remove(index)
                      },
                      okText: 'Delete Answer'
                    })
                  }} style={{ marginLeft: 10 ,fontSize:15}} />
                </Col>
             </Row>

            ))}
                    <Button onClick={e=>add()} icon={<PlusCircleTwoTone/>}>Add Option</Button>
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

export default AddQuestion
