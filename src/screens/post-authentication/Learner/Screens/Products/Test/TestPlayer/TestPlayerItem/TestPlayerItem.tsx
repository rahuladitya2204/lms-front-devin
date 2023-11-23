import { BackwardOutlined, CheckCircleTwoTone, CheckOutlined, DeleteOutlined, FlagOutlined, ForwardOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Form, Image, Progress, Radio, Row, Space, Spin, Tag, Tooltip, Typography, theme } from 'antd';
import { Enum, Learner, Store, Types } from '@adewaskar/lms-common';
import { Fragment, useEffect, useState } from 'react';

import HtmlViewer from '@Components/HtmlViewer/HtmlViewer';
import TestPlayerFiles from './TestPlayerFiles';
import TextArea from '@Components/Textarea';
import { htmlToText } from 'html-to-text';
import useBreakpoint from '@Hooks/useBreakpoint';
import useMessage from '@Hooks/useMessage';
import { useParams } from 'react-router';
import useQuestion from '../hooks/useQuestion';
import { useTestItemTime } from '@User/Screens/Event/LiveSessionPlayer/User/useTestItemTime';
import useTestNavigation from '@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation';

const { Title, Text } = Typography;

interface TestPlayeritemPropsI {}

export default function TestPlayeritem(props: TestPlayeritemPropsI) {
  // useTestItemTime();
  const { questionId, testId } = useParams<{ questionId: string; testId: string }>();
  const {mutate: updateQuestionResponseFlag,isLoading: updatingFlag} = Learner.Queries.useUpdateQuestionResponseFlag(testId+'')
  const [form] = Form.useForm<Types.SubmitTestAnswer>();
  const message = useMessage();
  const { currentQuestion, currentQuestionIndex, loading } = useQuestion();
  // const { mutate: submitAnswer, isLoading: submittingAnswer } = Learner.Queries.useSubmitTestAnswer();
  const { data: test}=Learner.Queries.useGetTestDetails(testId+'',Enum.TestDetailMode.TEST)
  const { mutate: submitAnswer,isLoading: submittingAnswer } = Learner.Queries.useSubmitTestAnswer(testId+'');
  const answer = Form.useWatch(['answer'], form);
  const { isMobile } = useBreakpoint();
  useEffect(() => {
    const { answerGiven } = currentQuestion;
      let answer = answerGiven;
      if (
        (currentQuestion.type === 'single') &&
        answerGiven &&
        answerGiven.options &&
        answerGiven.options.length) {
        // @ts-ignore
        answer = { options: answerGiven.options[0] };
      }
      // @ts-ignore
      form.setFieldsValue({
        answer
      }); 
  }, [currentQuestion, form,questionId]);
  const isValid = ((answer?.options?.length) || (answer?.subjective?.text));

  // @ts-ignore
  const onFormSubmit = ({ answer }) => {
    if (!isValid) {
      return;
    }
    if (currentQuestion.type=== 'single') {
      // @ts-ignore
      answer = { options: [answer.options] };
    }

    submitAnswer({
      testId: testId + '',
      questionId: questionId + '',
      answer: answer,
    }, {
      onSuccess: () => {
        navigate('next')
      }
    });
  };

  const { navigate } = useTestNavigation(test);
  const OptionSelectedFormControl = currentQuestion.type === 'single' ? Radio : Checkbox;
  const answerText = htmlToText(answer?.subjective?.text);
  const wordLength = answerText.split(' ').length;
  const PrevButton = <Button shape={!isMobile?'default':'circle'} onClick={() => navigate('prev')} style={{ marginRight: !isMobile?20:0 }} icon={<BackwardOutlined />}>
    {!isMobile?'Previous':''}
  </Button>;
  const NextButton = <Button shape={!isMobile?'default':'circle'} onClick={() => navigate('next')} icon={<ForwardOutlined />}>
    {!isMobile ? 'Next' : ''}
  </Button>;
  // const correctOptions = currentQuestion.options.filter(e => e.isCorrect).map(i=>i._id);
  return (
    <Spin spinning={loading}>
      <Card title={`Question ${currentQuestionIndex + 1}`} >
      <Form layout='vertical' form={form} onFinish={onFormSubmit}>
        <div style={{ minHeight: '72vh' }}>
          <Row gutter={[20, 30]}>
            <Col span={24}>
              <HtmlViewer content={currentQuestion.title} />
              {currentQuestion.type !== 'subjective' ? <>
                <Text style={{ marginTop: 20, fontSize: currentQuestion.type === 'single' ? 16 : 18 }} type="secondary">
                {currentQuestion.type === 'single' ? 'Select one among others' : 'Select all that apply'}
              </Text>
              <Form.Item name={['answer','options']}  >
                <OptionSelectedFormControl.Group style={{ width: '100%',display:'block' }}>
                    {currentQuestion.options.map((option: Types.TestQuestionOption, index: number) => {
                    const SelectFormControlComponent=      <OptionSelectedFormControl value={option._id}>
                    <HtmlViewer content={option.text} />
                  </OptionSelectedFormControl>
                    return (
                      <Row gutter={[0, 20]} key={option._id}>
                        <Col span={24}>
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
                  <Form.Item style={{marginTop:10}} label={<Text>Enter Answer below - <Text type='danger'>{ wordLength} words</Text></Text>} name={['answer', 'subjective', 'text']} >
                    <TextArea height={400} html={{ level: 1 }} />
                    
  </Form.Item>
              </>}
            </Col>
           
          </Row>
        </div>

        <Row justify="space-between">
        {!isMobile?  <Col flex={1} >
              {PrevButton}
              {NextButton}
          </Col>:null}
            <Col style={{ display: 'flex', flex:isMobile?1:'',flexDirection: 'row-reverse',justifyContent:'space-between'}}>
              <Fragment>
              {isMobile?NextButton:null}
      <Button
              disabled={!isValid}
              type="primary" loading={submittingAnswer}
              style={{ marginLeft: 20,marginRight:20 }}
              onClick={form.submit}
            >
              Submit Answer
              </Button>
              {isMobile?PrevButton:null}
            </Fragment>

              {!isMobile?<>
              {currentQuestion.isMarked ?
              <Button loading={updatingFlag}
                type='primary'
                onClick={() => updateQuestionResponseFlag({
                  questionId: questionId + '', flag: 'reviewed'
                })}
                icon={<CheckOutlined/>} danger>
              Review Done
              </Button> : <Button loading={updatingFlag}
                onClick={() => updateQuestionResponseFlag(
                  {
                     questionId: questionId + '',
                    flag: 'review-later'
                  })}
                icon={<FlagOutlined />} danger type="default">
              Mark for review
                  </Button>}
              </>:null}
           
          </Col>
        </Row>
      </Form>
     </Card>
    </Spin>
  );
}
