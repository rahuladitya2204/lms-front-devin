import { BackwardOutlined, CheckCircleTwoTone, CheckOutlined, DeleteOutlined, FlagOutlined, ForwardOutlined, GlobalOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Form, Image, Input, List, Progress, Radio, Row, Skeleton, Space, Spin, Tag, Tooltip, Typography, theme } from 'antd';
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
  const { data:{metadata:{test:{language}}}} = Learner.Queries.useGetEnrolledProductDetails({ type: Enum.ProductType.TEST, id: testId + '' });
  const { currentQuestion, currentQuestionIndex, loading: loadingQuestion } = useReviewQuestion();
  const answerGiven = currentQuestion.answerGiven
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '',Enum.TestDetailMode.RESULT);
  useEffect(() => {
    let answer = answerGiven;
    if (
      (currentQuestion.type === Enum.TestQuestionType.SINGLE) &&
      answerGiven &&
      (answerGiven?.options?.length)) {
      // @ts-ignore
      answer = { options: answerGiven?.options[0] };
    }
    if (
      (currentQuestion.type === Enum.TestQuestionType.MULTIPLE) &&
      answerGiven &&
      answerGiven &&
      answerGiven.options.length) {
      // @ts-ignore
      answer = { options: answerGiven?.options };
    }

    if (
      (currentQuestion.type === Enum.TestQuestionType.NUMERIC) &&
      (!isNaN(Number(answerGiven?.numeric)))) {
      // @ts-ignore
      answer = {numeric:answerGiven.numeric};
    }
        form.setFieldsValue({
      answer
    });
   
  }, [currentQuestion, form,questionId]);
  const answer = Form.useWatch(['answer'], form);
  const { navigate } = useTestNavigation(test);
  const OptionSelectedFormControl = currentQuestion.type === Enum.TestQuestionType.SINGLE ? Radio : Checkbox;
  const answerText = htmlToText(answer?.subjective?.text);

  const { token } = theme.useToken()
  const { isMobile} = useBreakpoint();
  const correctOptions = currentQuestion?.options?.filter(i => i.isCorrect).map(i => i._id);
  
  const NextButton =  <Button shape={!isMobile?'default':'circle'} onClick={() => navigate('next')} icon={<ForwardOutlined />}>
{!isMobile?'Next':''}
  </Button>;
  
  const PrevButton = <Button shape={!isMobile?'default':'circle'} onClick={() => navigate('prev')}
  style={{ marginRight: !isMobile?20:0 }} icon={<BackwardOutlined />}>
{!isMobile?'Previous':''}
  </Button>;
  const SkelArray = [1, 1, 1, 1];
  return (
      <Card title={`Question ${currentQuestionIndex + 1}`}
        extra={!isMobile?[<TestAnswerTag item={currentQuestion} />,
        !currentQuestion.notEvaluated? ((currentQuestion.scoreAchieved !== undefined) ?
          <Tag color={(currentQuestion.scoreAchieved > 0) ?
            // @ts-ignore
            'green-inverse' : 'red-inverse'}>Score: {currentQuestion.scoreAchieved}{currentQuestion.type==='subjective'?('/'+currentQuestion.score.correct):'' }</Tag> : 
            <Tag color='red-inverse'>Score: 0</Tag>):null
        ] : null
      }
      >
      <Form layout='vertical' form={form}>
        <div style={{ minHeight: '72vh' }}>
          <Row gutter={[20, 30]}>
              {loadingQuestion?<Col span={24}>
                          {/* @ts-ignore */}
              <Skeleton style={{marginBottom:25}} active paragraph={{rows:1}} />
              <Row gutter={[10,20]}>
                
                <Col span={24}>
                <Skeleton.Button active style={{height:20}} block />
                </Col>
                {SkelArray.map(()=><Col span={24}>
                  <Row gutter={[10,20]}>
                    <Col>
                      <Skeleton.Avatar active size={20} shape={'circle'} />
</Col>
                <Col flex={1}>
                <Skeleton.Button active style={{height:20}} block />
             </Col>
                  </Row>
               </Col>)}
              </Row>
 </Col>:<Col span={24}>
                          {/* @ts-ignore */}
              <HtmlViewer content={currentQuestion.title?.text[language]+''} />
              {currentQuestion.type !== 'subjective' ? ((currentQuestion.type===Enum.TestQuestionType.SINGLE || currentQuestion.type===Enum.TestQuestionType.MULTIPLE)?<>
                <Text style={{ marginTop: 20, fontSize: currentQuestion.type === Enum.TestQuestionType.SINGLE ? 16 : 18 }} type="secondary">
                {currentQuestion.type === Enum.TestQuestionType.SINGLE ? 'Select one among others' : 'Select all that apply'}
              </Text>
                  <Form.Item name={['answer', 'options']}>
                  <OptionSelectedFormControl.Group style={{ width: '100%',display:'block' }}>
                    <List dataSource={currentQuestion?.options} renderItem={(option => {
                      const SelectFormControlComponent = <OptionSelectedFormControl
                      style={{ marginRight: 0 }}
                      disabled
                      value={option._id}>
                  
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
                          {/* @ts-ignore */}
                          <HtmlViewer content={option.text[language]} />
                        </Space>
                      </Col>
                    </Row>
                  );
                    })} />
                </OptionSelectedFormControl.Group>
                </Form.Item>
                </>:null) : <>
                    {test.input.type === Enum.TestInputType.HANDWRITTEN ?
                      <TestPlayerFiles review testId={testId + ''} questionId={questionId + ''} /> :
                      (answerGiven?.subjective?.text) ? <Form.Item label='Answer Given'>
                      <HtmlViewer content={answerGiven?.subjective?.text} />
                    </Form.Item>:<Tag color='red' >Not Answered</Tag>}     
                </>}
               {currentQuestion.type===Enum.TestQuestionType.NUMERIC? <Form.Item style={{marginTop:20}} label='Answer Given' name={['answer','numeric']} >
                  {currentQuestion.isAnswered?<Input style={{width:150}} type='number' readOnly />:<TestAnswerTag item={currentQuestion} />}
                </Form.Item> : null
                }
            </Col>}
           
          </Row>
        </div>

    
        <Row justify="space-between" style={{marginTop:10}}>
        {!isMobile?  <Col style={{ display: 'flex',justifyContent:'space-between'}} flex={1} >
              {PrevButton}
              {NextButton}
          </Col>:null}
            <Col style={{ display: 'flex', flex:isMobile?1:'',flexDirection: 'row-reverse',justifyContent:'space-between'}}>
              <Fragment>
              {isMobile?NextButton:null}
              {isMobile?PrevButton:null}
            </Fragment>           
          </Col>
        </Row>
      </Form>
      </Card>
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


