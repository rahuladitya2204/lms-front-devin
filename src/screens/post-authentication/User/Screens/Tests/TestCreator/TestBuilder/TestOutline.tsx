import { Button, Col, Divider, Form, Input, Modal, Row, Select, Typography } from 'antd'
import { DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { Types, User } from '@adewaskar/lms-common'

import { useState } from 'react';

const {Text } = Typography;

interface TestOutlinePropsI {
  closeModal?: Function;
//   onValuesChange: Function;
  testId: string;
}

interface OutlineSection {title: string,itemCount:number,optionCount:number,score: number,questionType: string}

interface CreateTestOutline {
    sections: [OutlineSection]
}

export default function TestOutline({
    closeModal,
    testId
    // onValuesChange
}: TestOutlinePropsI) {
    const [totalScore, setTotalScore] = useState(0);
const calculateTotalScore = () => {
        let total = 0;
        form.getFieldValue('sections').forEach((section:OutlineSection) => {
          total += section.itemCount * section.score;
        });
        setTotalScore(total);
      };  const [form] = Form.useForm<CreateTestOutline>()
    const {
        mutate: updateTestApi,
        isLoading: updating
    } = User.Queries.useUpdateTest();
    const onSubmit = (e: CreateTestOutline) => {
        console.log(e, 'eee')
        // return;
        const sections = e.sections.map((section) => {
            const sectionItems = Array.from({ length: section.itemCount }).map(() => {
                const options = Array.from({ length: section.optionCount }).map(() => ({
                  text: null,
                  isCorrect: false,
                }));
          
                return {
                  title: '',
                  score: section.score,
                    options,
                  type: section.questionType
                };
              });
          
            return {
              title: section.title,
              items: sectionItems,
            };
        });
        
        updateTestApi(
            {
              id: testId || '',
                data: {
                //   @ts-ignore
                sections: sections
              }
            },
            {
              onSuccess: test => {
                closeModal&&closeModal();
              }
            }
          )
  }

  return (
    <Form  onValuesChange={calculateTotalScore} form={form} layout='vertical' onFinish={onSubmit}>
          <Row>
                <Col span={24}>
            <Form.List name="sections">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
             <Row justify={'space-between'} gutter={[10,10]}>
                    <Col span={4}>
                    <Form.Item label={`Section Title`}
                rules={[
                  { required: true, message: 'Please enter the answer.' },
                ]}
 name={[field.name,'title']}
                >
                    <Input/> 
                  </Form.Item>
                    </Col>
                    <Col span={4}>
                    <Form.Item  style={{width:130}} label={`Question Count`}
                rules={[
                  { required: true, message: 'Please enter the question count.' },
                ]}
                name={[field.name,'itemCount']}

                >
                    <Input type='number' /> 
                  </Form.Item>
                    </Col>

                    <Col span={4}>
                    <Form.Item label={`Total Options`}
                rules={[
                  { required: true, message: 'Please enter the total options in each question' },
                ]} initialValue={4}
                name={[field.name,'optionCount']}
                >
                    <Input type='number' /> 
                  </Form.Item>
                    </Col>
                    <Col span={4}>
                    <Form.Item label={`Question Type`}
                rules={[
                  { required: true, message: 'Please enter the question type' },
                            ]}
                            // initialValue={ }
                name={[field.name,'questionType']}
                >
                            <Select options={[{label:'Single Choice',value:'single'},{label:'Multiple Choice',value:'multiple'},{label:'Subjective',value:'subjective'}]} />
                  </Form.Item>
                    </Col>
                    <Col span={4}>
                    <Form.Item style={{width:80}} label={`Score`}
                rules={[
                  { required: true, message: 'Please enter the score.' },
                ]}
                name={[field.name,'score']}

                >
                    <Input type='number' /> 
                  </Form.Item>
                    </Col>
             </Row>

            ))}
                    <Button onClick={e=>add()} icon={<PlusCircleTwoTone/>}>Add Option</Button>
          </>
        )}
                  </Form.List>
            </Col>
          </Row>
        {totalScore? <><Divider/>  <Row justify='end'>
              <Col><Text strong>Total Score: {totalScore }</Text></Col>
          </Row></>:null}
      <Button style={{marginTop:50}} loading={updating} type="primary" onClick={form.submit}>
        Generate Outline
      </Button>
    </Form>
  )
}
