import { BackwardOutlined, CheckCircleTwoTone, CheckOutlined, CloseCircleTwoTone, CloseOutlined, DeleteOutlined, FlagOutlined, ForwardOutlined, GlobalOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Form, Image, Input, List, Progress, Radio, Row, Skeleton, Space, Spin, Tag, Tooltip, theme } from 'antd';
import { Constants, Enum, Learner, Types } from '@invinciblezealorg/lms-common';
import { Fragment, useEffect, useMemo, useState } from 'react';

import HtmlViewer from '@Components/HtmlViewer/HtmlViewer';
import { NavLink } from 'react-router-dom';
import { Paragraph } from '@Components/Typography/Typography';
import { TestAnswerTag } from '../TestResult/Table/TestResultTable';
import TestItemSkeleton from './TestItemSkeleton';
import TestPlayerFiles from '../TestPlayer/TestPlayerItem/TestPlayerFiles';
import TextArea from '@Components/Textarea';
import { Typography } from '@Components/Typography';
import { htmlToText } from 'html-to-text';
import useBreakpoint from '@Hooks/useBreakpoint';
import { useParams } from 'react-router';
import useTestNavigation from '@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation';

const { Title, Text } = Typography;

interface TestPlayerItemReiewPropsI {
  testId?: string;
  questionId?: string;
}

export default function TestPlayerItemReiew(props: TestPlayerItemReiewPropsI) {
  const [form] = Form.useForm();
  // { questionId, testId }
  const params = useParams<{ questionId: string; testId: string }>();
  const questionId = (props.questionId || params.questionId)+'';
  const testId = (props.testId || params.testId)+'';
  const { data:{metadata:{test:{language}}},isLoading: loadingEp} = Learner.Queries.useGetEnrolledProductDetails({ type: Enum.ProductType.TEST, id: testId + '' });
  const { currentQuestion, currentQuestionIndex, loading: loadingQuestion } = useReviewQuestion({questionId,testId});
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
  // @ts-ignore
  const globalCorrectPercent = (currentQuestion.analytics?.attempted)?((currentQuestion.analytics?.correctAttempts) / (currentQuestion.analytics?.attempted)*100):null;

  const { token } = theme.useToken()
  const { isMobile} = useBreakpoint();
  const correctOptions = currentQuestion?.options?.filter(i => i.isCorrect).map(i => i._id);
  
  const NextButton =  <Button shape={!isMobile?'default':'circle'} onClick={() => navigate('next')} icon={<ForwardOutlined />}>
{!isMobile?'Next':''}
  </Button>;
  const { isDesktop, width } = useBreakpoint();
  const {
    isLoading: loadingResult,
    data: { test: { sections } }
  } = Learner.Queries.useGetTestResult(testId + '');
  const questions = useMemo(() => {
    return sections.map(i => i.items).flat();
  }, [sections]);
  const PrevButton = <Button shape={!isMobile?'default':'circle'} onClick={() => navigate('prev')}
  style={{ marginRight: !isMobile?20:0 }} icon={<BackwardOutlined />}>
{!isMobile?'Previous':''}
  </Button>;
  return loadingQuestion ? <TestItemSkeleton /> : <>
  
  
  {!isDesktop? <Row align={'middle'}>
    <Col flex={1} style={{ width: 0.72 * width }}> <ul
      style={{
        display: 'flex', marginBottom: 15, listStyle: 'none', padding: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none', // For Firefox
        msOverflowStyle: 'none', // For Internet Explorer and Edge
        // '&::-webkit-scrollbar': {
        //   display: 'none', // For Chrome, Safari, and Opera
        // }
      }}>
{questions.map((item, index) => {
return (
  <li key={item._id} style={{ flexShrink: 0, marginRight: 8 }}>
   <NavLink

                              style={{ width: '100%' }}
                              key={item._id}
                              to={`/app/test/${testId}/result/review/${item._id}`}
                              children={() => {
                                const isActive = questionId === item._id
                                return (
                                  // <Badge count={isActive?<ArrowLeftOutlined  style={{fontSize:10}} />:null}>
                                  // <Badge count={item.isMarked? <HighlightTwoTone /> :null} showZero>
                                  <Button
                                    // loading={loading && isCurrent}
                                    onClick={() => navigate(item._id + '')}
                                    danger={item.isMarked}
                                    type={
                                      isActive
                                        ? 'primary'
                                        : item.isMarked
                                          ? 'primary'
                                          : item.isAnswered
                                            ? 'primary'
                                            : 'default'
                                    }
                                    style={{
                                      backgroundColor: isActive
                                        ? ''
                                        : item.isAnswered
                                          ? item.type !== 'subjective'
                                            ? item.isCorrect
                                              ? token.colorSuccessActive
                                              : token.colorError
                                            : token.colorWarningActive
                                          : 'default'
                                    }}
                                    shape="circle"
                                    // icon={
                                    //   item.isAnswered ? (
                                    //     <Fragment>
                                    //       {item.isCorrect ? (
                                    //         <CheckOutlined />
                                    //       ) : (
                                    //         <CloseOutlined />
                                    //       )}
                                    //     </Fragment>
                                    //   ) : null
                                    // }
                                  >
                                    {index + 1}
                                  </Button>
                                  //  </Badge>
                                )
                              }}
                            />
  </li>
);
})}
    </ul></Col>
  </Row>: null}
      <Card title={`Question ${currentQuestionIndex + 1}`}
      extra={[isMobile ? <>
        {currentQuestion.isCorrect ? <CheckCircleTwoTone style={{marginRight:5,position:"relative",top:3,fontSize:20,color:'green'}} />:<CloseCircleTwoTone style={{marginRight:5,position:"relative",top:3,fontSize:20,color: 'red'}}/>}
      </> : <TestAnswerTag item={currentQuestion} />,
        !currentQuestion.notEvaluated? ((currentQuestion.scoreAchieved !== undefined) ?
          <Tag color={(currentQuestion.scoreAchieved > 0) ?
            // @ts-ignore
            'green-inverse' : 'red-inverse'}>Score: {currentQuestion.scoreAchieved}{currentQuestion.type==='subjective'?('/'+currentQuestion.score.correct):'' }</Tag> : 
            <Tag color='red-inverse'>Score: 0</Tag>) : null,
          globalCorrectPercent!==null?<Tooltip title={`${(globalCorrectPercent<50 && globalCorrectPercent!==0)?'Only ':''}${globalCorrectPercent}% people were able to answer this question correctly`}><Tag color='purple-inverse' icon={<GlobalOutlined />} >{(globalCorrectPercent)} %</Tag></Tooltip>:null
        ]
      }
      >
      <Form layout='vertical' form={form}>
        <div style={{ minHeight: '50vh' }}>
          <Row gutter={[20, 30]}>
          <Col span={24}>
              <Paragraph style={{ fontSize: 15 }}>
                {/* @ts-ignore */}
                {loadingEp?<Skeleton paragraph={{rows:1}} />: <HtmlViewer content={currentQuestion.title?.text[language] + ''} />}
               
                </Paragraph>
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
                          <Paragraph style={language === 'hin' ? { fontSize: 16 } : { fontSize: 15 }}>
                          {/* @ts-ignore */}
                          <HtmlViewer content={option.text[language]} />
                            </Paragraph>
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
            </Col>
           
          </Row>
        </div>

    
        {!props.questionId?<Row justify="space-between" style={{marginTop:10}}>
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
        </Row>:null}
      </Form>
      </Card>
  </>;
}



export function useReviewQuestion(d?: {testId:string,questionId:string}) {
  const params = useParams()
  const testId = d?.testId || params.testId;
  const questionId = d?.questionId || params.questionId;
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


