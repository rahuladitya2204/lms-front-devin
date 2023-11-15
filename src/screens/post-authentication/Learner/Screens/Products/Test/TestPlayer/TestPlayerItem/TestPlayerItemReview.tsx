import { BackwardOutlined, CheckCircleTwoTone, CheckOutlined, DeleteOutlined, FlagOutlined, ForwardOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Form, Image, Progress, Radio, Row, Space, Spin, Tag, Tooltip, Typography, theme } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { Learner, Types } from '@adewaskar/lms-common';

import HtmlViewer from '@Components/HtmlViewer';
import TestPlayerFiles from './TestPlayerFiles';
import TextArea from '@Components/Textarea';
import { htmlToText } from 'html-to-text';
import useMessage from '@Hooks/useMessage';
import { useParams } from 'react-router';
import useQuestion from '../hooks/useQuestion';
import { useTestItemTime } from '@User/Screens/Event/LiveSessionPlayer/User/useTestItemTime';
import useTestNavigation from '@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation';

const { Title, Text } = Typography;

interface TestPlayerItemReiewPropsI {}

export default function TestPlayerItemReiew(props: TestPlayerItemReiewPropsI) {
  const [form] = Form.useForm();
  const { questionId, testId } = useParams<{ questionId: string; testId: string }>();
  const { currentQuestion, currentQuestionIndex, loading } = useQuestion();
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '');
  useEffect(() => {
    const { answerGiven } = currentQuestion;
    console.log(answerGiven, 'answerGiven');
    let answer = answerGiven;
    if (
      (currentQuestion.type === 'single') &&
      answerGiven &&
      answerGiven.options &&
      answerGiven.options.length) {
      // @ts-ignore
      answer = {options:answerGiven.options[0]};
    }
    form.setFieldsValue({
      answer
    });
   
  }, [currentQuestion, form,questionId]);
  const answer = Form.useWatch(['answer'], form);
  const { navigate } = useTestNavigation(test);
  const OptionSelectedFormControl = currentQuestion.type === 'single' ? Radio : Checkbox;
  const answerText = htmlToText(answer?.subjective?.text);

  const { token } = theme.useToken()

  const answerGiven = currentQuestion.answerGiven;
  const correctOptions = currentQuestion.options.filter(i => i.isCorrect).map(i => i._id);
  return (
    <Spin spinning={loading}>
      <Form layout='vertical' form={form}>
        <div style={{ minHeight: '72vh' }}>
          <Row gutter={[20, 30]}>
            <Col span={24}>
              <Row justify={'space-between'}>
                <Col>
                <Title style={{ margin: 0 }} level={5} type="secondary">
                Question {currentQuestionIndex + 1}
                  </Title>
                </Col>
                {/* <Col>
                  <span>Time Spent</span>
                </Col> */}
              </Row>
              <HtmlViewer content={currentQuestion.title} />
              {currentQuestion.type !== 'subjective' ? <>
                <Text style={{ marginTop: 20, fontSize: currentQuestion.type === 'single' ? 16 : 18 }} type="secondary">
                {currentQuestion.type === 'single' ? 'Select one among others' : 'Select all that apply'}
              </Text>
              <Form.Item name={['answer','options']}  >
                <OptionSelectedFormControl.Group style={{ width: '100%',display:'block' }}>
                    {currentQuestion.options.map((option: Types.TestQuestionOption, index: number) => {
                    const SelectFormControlComponent = <OptionSelectedFormControl disabled value={option._id}>
                    <HtmlViewer content={option.text} />
                  </OptionSelectedFormControl>
                    return (
                      <Row gutter={[0, 20]} key={option._id}>
                        <Col span={24}>
                          {/* @ts-ignore */}
                          {answerGiven?.options?.indexOf(option?._id) > -1 ?
                            <Tooltip placement="top" title={`Correct Answer`}>
                              <CheckCircleTwoTone color={token.colorSuccessBg} />
                            </Tooltip> : null}
                         {SelectFormControlComponent}
                        </Col>
                      </Row>
                    );
                  })}
                </OptionSelectedFormControl.Group>
                </Form.Item>
              </> : <>
                  {(answer?.subjective?.files?.length)?<Form.Item>
                    {/* @ts-ignore */}
 <TestPlayerFiles form={form}/>
                  </Form.Item>:<Button>Upload Files</Button>}
                  <Divider />
                  <Text strong type='danger' >Answer in {currentQuestion.wordLimit} words</Text>
                  <Form.Item style={{marginTop:10}} label={<Text>Enter Answer below - <Text type='danger'>{ answerText.length} words</Text></Text>} name={['answer', 'subjective', 'text']} >
                    <TextArea height={400} html={{ level: 1 }} />
                    
  </Form.Item>
              </>}
            </Col>
           
          </Row>
        </div>

        <Row justify="space-between">
          <Col flex={1} style={{justifyContent:'space-between',display:'flex'}}>
            <Button type={'primary'} onClick={() => navigate('prev')} style={{ marginRight: 20 }} icon={<BackwardOutlined />}>
              Previous
            </Button>
            <Button type={'primary'} onClick={() => navigate('next')} icon={<ForwardOutlined />}>
              Next
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}
