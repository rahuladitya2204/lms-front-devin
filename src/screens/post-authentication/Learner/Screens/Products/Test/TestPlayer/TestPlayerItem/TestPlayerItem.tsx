import { BackwardOutlined, DeleteOutlined, FlagOutlined, ForwardOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Image, Progress, Radio, Row, Space, Spin, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { Learner, Types } from '@adewaskar/lms-common';

import ActionModal from '@Components/ActionModal';
import FileList from '@Components/FileList';
import HtmlViewer from '@Components/HtmlViewer';
import MediaUpload from '@Components/MediaUpload';
import TestPlayerFiles from './TestPlayerFiles';
import TextArea from '@Components/Textarea';
import useMessage from '@Hooks/useMessage';
import { useParams } from 'react-router';
import useQuestion from '../hooks/useQuestion';
import useTestNavigation from '@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation';

const { Title, Text } = Typography;

interface TestPlayeritemPropsI {}

export default function TestPlayeritem(props: TestPlayeritemPropsI) {
  const [form] = Form.useForm();
  const message = useMessage();
  const { questionId, testId } = useParams<{ questionId: string; testId: string }>();
  const { currentQuestion, currentQuestionIndex, loading } = useQuestion();
  const { mutate: submitAnswer, isLoading: submittingAnswer } = Learner.Queries.useSubmitTestAnswer();

  useEffect(() => {
    const { answerGiven } = currentQuestion;
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

  // @ts-ignore
  const onFormSubmit = ({answer}) => {
    console.log(answer,'rr')
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

  const { data: test}=Learner.Queries.useGetTestDetails(testId+'')
  const { navigate } = useTestNavigation(test);
  const OptionSelectedFormControl = currentQuestion.type === 'single' ? Radio : Checkbox;
  const answer = form.getFieldValue(['answer']);
  return (
    <Spin spinning={loading}>
      <Form layout='vertical' form={form} onFinish={onFormSubmit}>
        <div style={{ minHeight: '72vh' }}>
          <Row gutter={[20, 30]}>
            <Col span={24}>
              <Title style={{ margin: 0 }} level={5} type="secondary">
                Question {currentQuestionIndex + 1}
              </Title>
              <HtmlViewer content={currentQuestion.title} />
              {currentQuestion.type !== 'subjective' ? <>
                <Text style={{ marginTop: 20, fontSize: currentQuestion.type === 'single' ? 16 : 18 }} type="secondary">
                {currentQuestion.type === 'single' ? 'Select one among others' : 'Select all that apply'}
              </Text>
              <Form.Item name={['answer','options']}>
                <OptionSelectedFormControl.Group style={{ width: '100%' }}>
                  {currentQuestion.options.map((option: Types.TestQuestionOption, index: number) => {
                    return (
                      <Row gutter={[0, 20]} key={option._id}>
                        <Col span={24}>
                          <OptionSelectedFormControl disabled={submittingAnswer} value={option._id}>
                            <HtmlViewer content={option.text} />
                          </OptionSelectedFormControl>
                        </Col>
                      </Row>
                    );
                  })}
                </OptionSelectedFormControl.Group>
                </Form.Item>
              </> : <>
                  <Form.Item>
                    {/* @ts-ignore */}
 <TestPlayerFiles form={form}/>
</Form.Item>
                  <Text strong type='danger' >Answer in {currentQuestion.wordLimit} words</Text>
                  <Form.Item style={{marginTop:10}} label='Enter Answer below' name={['answer', 'subjective', 'text']} >
                  <TextArea height={400} html={{ level: 1 }} /></Form.Item>
              </>}
            </Col>
           
          </Row>
        </div>

        <Row justify="space-between">
          <Col>
            <Button onClick={() => navigate('prev')} style={{ marginRight: 20 }} icon={<BackwardOutlined />}>
              Previous
            </Button>
            <Button onClick={() => navigate('next')} icon={<ForwardOutlined />}>
              Next
            </Button>
          </Col>
          <Col>
            <Button icon={<FlagOutlined />} danger type="default">
              Mark for review
            </Button>
            <Button
              loading={submittingAnswer}
              type="primary"
              style={{ marginLeft: 20 }}
              onClick={form.submit}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}
