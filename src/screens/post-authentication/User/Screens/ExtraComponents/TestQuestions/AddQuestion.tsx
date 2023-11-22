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
import { Constants, Types, Utils } from '@adewaskar/lms-common'
import { DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { Fragment, useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal';
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
  useEffect(
    () => {
      if (props.data) {
        // setCorrectOptions(props.data.correctOptions);
          form.setFieldsValue(props.data);
      }
          else
      {
        form.setFieldsValue(Constants.INITIAL_PRODUCT_DISCUSSION_QUESTION);
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
  const options = Form.useWatch('options', form) || [];
  // const isValid = Utils.validateTestQuestion(props.data);
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
                <Row gutter={[20,20]}>
                <Form.List name="options">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }, index) => {
        const currentOption = options[index] || Constants.INITIAL_TEST_QUESTION_OPTION;

        return (
          <Col md={12}>
              <Row key={key} justify={'center'} align="middle">
              <Col flex={1}>
                        <Form.Item 
                            rules={[
                                { required: true, message: 'Please enter the answer.' },
                            ]}
                            {...restField}
                            name={[name, 'text']}
                          >
                            <TextArea height={150} placeholder={`Answer ${index + 1}`}/> 
                        </Form.Item>
                    </Col>
                            <Col>
                            <Form.Item  {...restField}
                              name={[name, 'isCorrect']}
                              valuePropName="checked">
                    <OptionSelectedFormControl
                      checked={!!currentOption?.isCorrect} value={false}
                            // value={index} // Assigning value to OptionSelectedFormControl
                            // checked={!!currentOption.isCorrect} // Calculating checked status
                            // disabled={!!item.isAiGenerated}
                        onClick={e => {
                          const opts = [...options];
                          // @ts-ignore
                                if (e.target.checked) {
                                  if (questionType === 'single') {
                                    opts.forEach(o => {
                                      o.isCorrect = false;
                                    })
                                  }
                                  opts[index].isCorrect = true;
                                }
                                else {
                                  opts[index].isCorrect = false;
                                }

                          form.setFieldsValue({
                            options: opts
                          });
                          // onFormChange
                                // setCorrectOptions(options);
                            }}
                            style={{ marginLeft: 20 }}
                      />
                      </Form.Item>
                    
                        <DeleteTwoTone onClick={e => {
                            confirm({
                                title: 'Are you sure?',
                                content: `You want to delete this answer`,
                                onOk() {
                                    remove(index);
                                },
                                okText: 'Delete Answer'
                            });
                        }} style={{ marginLeft: 10 ,fontSize: 15 }} />
                    </Col>
          </Row>
        </Col>
        );
      })}

      <Row justify="center">
        <Col>
          <Button onClick={() => add()} icon={<PlusCircleTwoTone />} type="dashed">
            Add Option
          </Button>
        </Col>
      </Row>
    </>
  )}
</Form.List>
         </Row>
            </Card>
          </Col>
              </Row>
              <Button  onClick={form.submit} type='primary'>
                Save Question
              </Button>
        </Form>
        </Col>
    </Row>
  )
}

export default AddQuestion
