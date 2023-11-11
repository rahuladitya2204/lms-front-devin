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

interface TestPlayeritemPropsI {}

export default function TestPlayeritem(props: TestPlayeritemPropsI) {
  useTestItemTime();
  const {mutate:updateQuestionResponseFlag,isLoading:updatingFlag } = Learner.Queries.useUpdateQuestionResponseFlag();
  const [form] = Form.useForm();
  const message = useMessage();
  const { questionId, testId } = useParams<{ questionId: string; testId: string }>();
  const { currentQuestion, currentQuestionIndex, loading } = useQuestion();
  const { mutate: submitAnswer, isLoading: submittingAnswer } = Learner.Queries.useSubmitTestAnswer();
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
  const isValid = ((answer?.options?.length) || (answer?.subjective?.text));

  // @ts-ignore
  const onFormSubmit = ({answer}) => {
    if (!isValid) {
      return;
    }
    if (currentQuestion.type=== 'single') {
      // @ts-ignore
      answer = { options: [answer.options] };
    }
    submitAnswer({
      testId: testId+'',
      questionId: questionId+'',
      answers: answer,
    }, {
      onSuccess: () => {
        message.open({
          type: 'success',
          content: 'Answer Recorded',
        });
        navigate('next');
      },
    });
  };

  const { data: test } = Learner.Queries.useGetTestDetails(testId + '');
  const { navigate } = useTestNavigation(test);
  const OptionSelectedFormControl = currentQuestion.type === 'single' ? Radio : Checkbox;
  const answerText = htmlToText(answer?.subjective?.text);
  const {
    data: { hasEnded }
  } = Learner.Queries.useGetTestStatus(testId + '');
  const { token } = theme.useToken()

  const VIEWING_MODE = (hasEnded && !test.isLive) ? 'review' : 'test';
  const correctOptions = currentQuestion.options.filter(e => e.isCorrect).map(i=>i._id);
  return (
    <Spin spinning={loading}>
      <Form layout='vertical' form={form} onFinish={onFormSubmit}>
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
                    const SelectFormControlComponent=      <OptionSelectedFormControl disabled={(submittingAnswer || (VIEWING_MODE==='review'))} value={option._id}>
                    <HtmlViewer content={option.text} />
                  </OptionSelectedFormControl>
                    return (
                      <Row gutter={[0, 20]} key={option._id}>
                        <Col span={24}>
                          {/* @ts-ignore */}
                          {VIEWING_MODE === 'review' ? (correctOptions.indexOf(option?._id) > -1 ?
                            <Tooltip placement="top" title={`Correct Answer`}><CheckCircleTwoTone color={token.colorSuccessBg} /> </Tooltip> :null) :null}
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
                  {/* <OCRImages
                    imageUrls={['https://upload-junk.s3.us-west-2.amazonaws.com/6368e34a86402abb8d2737a9/php3KnIpw-1699453222894-2.jpeg']} /> */}
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
          <Col flex={1} style={VIEWING_MODE === 'test' ? {}:{justifyContent:'space-between',display:'flex'}}>
            <Button type={VIEWING_MODE==='review'?'primary':'default'} onClick={() => navigate('prev')} style={{ marginRight: 20 }} icon={<BackwardOutlined />}>
              Previous
            </Button>
            <Button type={VIEWING_MODE==='review'?'primary':'default'} onClick={() => navigate('next')} icon={<ForwardOutlined />}>
              Next
            </Button>
          </Col>
      {VIEWING_MODE==='test'?    <Col style={{display:'flex',flexDirection:'row-reverse'}}>
      <Button
              loading={submittingAnswer} disabled={!isValid}
              type="primary"
              style={{ marginLeft: 20 }}
              onClick={form.submit}
            >
              Submit Answer
            </Button>
            {/* @ts-ignore */}
            {currentQuestion.isMarked ?
              <Button loading={updatingFlag}
                type='primary'
                onClick={() => updateQuestionResponseFlag({
                  testId: testId + '',
                  itemId: questionId + '', flag: 'reviewed'
                }, {
                  onSuccess: () => {
                    message.open({type:'success',content:'Review Done'})
                  }
                })}
                icon={<CheckOutlined/>} danger>
              Review Done
              </Button> : <Button loading={updatingFlag}
                onClick={() => updateQuestionResponseFlag(
                  {
                    testId: testId + '', itemId: questionId + '',
                    flag: 'review-later'
                  }, {
                    onSuccess: () => {
                      message.open({type:'success',content:'Marked for review later'})
                    }
                  })}
                icon={<FlagOutlined />} danger type="default">
              Mark for review
            </Button>}
           
          </Col>:null}
        </Row>
      </Form>
    </Spin>
  );
}
