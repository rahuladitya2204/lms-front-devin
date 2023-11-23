import { BackwardOutlined, CheckCircleTwoTone, CheckOutlined, DeleteOutlined, FlagOutlined, ForwardOutlined, GlobalOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Form, Image, Progress, Radio, Row, Space, Spin, Tag, Tooltip, Typography, theme } from 'antd';
import { Constants, Enum, Learner, Types } from '@adewaskar/lms-common';
import { Fragment, useEffect, useState } from 'react';

import HtmlViewer from '@Components/HtmlViewer/HtmlViewer';
import { TestAnswerTag } from '../TestResult/Table/TestResultTable';
import TestPlayerFiles from '../TestPlayer/TestPlayerItem/TestPlayerFiles';
import TextArea from '@Components/Textarea';
import { htmlToText } from 'html-to-text';
import useBreakpoint from '@Hooks/useBreakpoint';
import { useParams } from 'react-router';
import useTestNavigation from '@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation';

const { Title, Text } = Typography;

interface TestPlayerItemReiewPropsI {}

export default function TestPlayerItemReiew(props: TestPlayerItemReiewPropsI) {
  const [form] = Form.useForm();
  const { questionId, testId } = useParams<{ questionId: string; testId: string }>();
  const { currentQuestion, currentQuestionIndex, loading } = useReviewQuestion();
  const answerGiven = currentQuestion.answerGiven
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '',Enum.TestDetailMode.RESULT);
  useEffect(() => {
    let answer = answerGiven;
    if (
      (currentQuestion.type === 'single') &&
      answerGiven &&
      (answerGiven?.options?.length)) {
      // @ts-ignore
      answer = {options:answerGiven[0]};
    }
    if (
      (currentQuestion.type === 'multiple') &&
      answerGiven &&
      answerGiven &&
      answerGiven.options.length) {
      // @ts-ignore
      answer = {options:answerGiven};
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
  const { isMobile} = useBreakpoint();
  const correctOptions = currentQuestion?.options?.filter(i => i.isCorrect).map(i => i._id);
  return (
    <Spin spinning={loading}>
      <Card title={`Question ${currentQuestionIndex + 1}`}
        extra={!isMobile?[<TestAnswerTag item={currentQuestion} />,
        currentQuestion.scoreAchieved !== undefined ?
          <Tag color={(currentQuestion.scoreAchieved > 0) ?
            'green-inverse' : 'red-inverse'}>Score: {currentQuestion.scoreAchieved}</Tag> : 
          <Tag color='red-inverse'>Score: 0</Tag>] :null
      }
      >
      <Form layout='vertical' form={form}>
        <div style={{ minHeight: '72vh' }}>
          <Row gutter={[20, 30]}>
            <Col span={24}>
              <HtmlViewer content={currentQuestion.title+''} />
              {currentQuestion.type !== 'subjective' ? <>
                <Text style={{ marginTop: 20, fontSize: currentQuestion.type === 'single' ? 16 : 18 }} type="secondary">
                {currentQuestion.type === 'single' ? 'Select one among others' : 'Select all that apply'}
              </Text>
              <Form.Item name={['answer','options']}  >
                <OptionSelectedFormControl.Group style={{ width: '100%',display:'block' }}>
                    {currentQuestion?.options?.map((option: Types.TestQuestionOption, index: number) => {
                      const SelectFormControlComponent =<OptionSelectedFormControl style={{marginRight:0}} disabled value={option._id}>
                    
                    </OptionSelectedFormControl>
                    return (
                      <Row gutter={[0, 20]} key={option._id}>
                        <Col span={24}>
                          <Space style={{display:'flex',flexDirection:'row',justifyContent:'flex-start'}} >
                                               {/* @ts-ignore */}
     {correctOptions?.indexOf(option?._id) > -1 ?
                            <Tooltip placement="top" title={`Correct Answer`}>
                              <CheckCircleTwoTone color={token.colorSuccessBg} />
                              </Tooltip> : null}
                            {SelectFormControlComponent}
                            <HtmlViewer content={option.text} />
                          </Space>
                        </Col>
                      </Row>
                    );
                  })}
                </OptionSelectedFormControl.Group>
                </Form.Item>
              </> : <>
                  {(answerGiven?.subjective?.files?.length)?<Form.Item>
                    {/* @ts-ignore */}
 <TestPlayerFiles form={form}/>
                  </Form.Item>:null}
                  <Divider />
                    <Form.Item label='Answer Given'>
                      <HtmlViewer content={answerGiven?.subjective?.text} />
                    </Form.Item>                    
              </>}
            </Col>
           
          </Row>
        </div>

        <Row justify="space-between">
          <Col flex={1} style={{justifyContent:'space-between',display:'flex'}}>
              <Button type={'primary'} onClick={() => navigate('prev')}
                style={{ marginRight: 20, width: 120 }} icon={<BackwardOutlined />}>
              Previous
            </Button>
            <Button style={{width: 120}} type={'primary'} onClick={() => navigate('next')} icon={<ForwardOutlined />}>
              Next
            </Button>
          </Col>
        </Row>
      </Form>
      </Card>
    </Spin>
  );
}



 export function useReviewQuestion() {
  const { questionId, testId } = useParams()
   const { data: { test: { sections } }, isFetching } = Learner.Queries.useGetTestResult(
     testId + ''
   );
  const questions = sections.map(e => e.items).flat()
   const currentQuestionIndex: number = questions.findIndex(
     q => q._id === questionId
   );
   const currentQuestion = questions[currentQuestionIndex] || {
     ...Constants.INITIAL_TEST_QUESTION,
     feedback: {
      met: '',
      notMet:''
    }
   };

  return {
    currentQuestion,
    currentQuestionIndex,
    loading: isFetching
  }
 }


