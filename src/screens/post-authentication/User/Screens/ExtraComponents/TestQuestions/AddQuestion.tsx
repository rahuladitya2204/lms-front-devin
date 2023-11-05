import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
} from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { Fragment, useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal';
import GenerateQuestionWithAI from './GenerateQuestionWithAI';
import TextArea from '@Components/Textarea';

const { confirm } = Modal;

export const QUESTION_TYPES=[
  { value: 'single', label: 'Single Choice' },
  { value: 'multiple', label: 'Multiple Choice' },
  { value: 'subjective', label: 'Subjective' },
];
interface CreateQuestionFormPropsI {
  submit?: (d: Types.TestQuestion) => void;
  data?: Types.TestQuestion;
  closeModal?: Function;
  onFormChange?: (d: Partial<Types.TestQuestion>) => void;
}


const AddQuestion: React.FC<CreateQuestionFormPropsI> = props => {
  const [form] = Form.useForm();
  const [correctOptions, setCorrectOptions] = useState<number[]>([]);
  useEffect(
    () => {
      if (props.data) {
        // setCorrectOptions(props.data.correctOptions);
          form.setFieldsValue(props.data);
      }
          else
      {
        form.setFieldsValue(Constants.INITIAL_COURSE_QUESTION);
    }
    },
    [props.data]
  ) 
    const submit = (e: Types.TestQuestion) => {
      props.submit && props.submit({ ...e });
      form.resetFields();
      props.closeModal && props.closeModal();
    }
  
  const questionType = Form.useWatch('type', form);
  const OptionSelectedFormControl = questionType === 'single' ? Radio : Checkbox;

  return (
    <Row gutter={[10,10]}>
      <Col span={24}>
        <ActionModal cta={<Button type='primary'>Generate with AI</Button>}>
          <GenerateQuestionWithAI submit={d => {
            // setCorrectOptions(d.correctOptions)
            form.setFieldsValue(d);
    }}/>
        </ActionModal>
        <Divider/>
   </Col>
      <Col span={24}>
   
      <Form name='quiz' onFinish={submit} onValuesChange={props.onFormChange?props.onFormChange:console.log}
        form={form}
        layout="vertical"
      >
        <Form.Item name="title" label="Title" required   rules={[
            {
              required: true,
              message: "Enter questions's title"
            }
          ]}>
          <TextArea placeholder="Enter the question title" />
        </Form.Item>
        <Row gutter={[20, 20]}>
          <Col span={12}>
          <Form.Item label='Question Type' name={'type'}>
        <Select
      style={{ width: 240 }}
      options={QUESTION_TYPES}
    />

        </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item name="score" label="Question Score" required  rules={[
            {
              required: true,
              message: "Enter the score for this question"
            }
          ]}>
          <Input placeholder="Enter the score for this question" />
        </Form.Item>
          </Col>
       </Row>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card style={{ marginBottom: 20 }} title="Answers">
            <Form.List name="options">
        {(fields, { add, remove }) => (
                    <>
                      <OptionSelectedFormControl.Group>
            {fields.map((field, index) => (
             <Row justify={'center'}>
                    <Col flex={1}>
                    <Form.Item 
                rules={[
                  { required: true, message: 'Please enter the answer.' },
                ]}
                {...field}
                >
                    <TextArea placeholder={`Answer ${index + 1}`}/> 
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
                        </OptionSelectedFormControl.Group>
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
        </Col>
    </Row>
  )
}

export default AddQuestion
