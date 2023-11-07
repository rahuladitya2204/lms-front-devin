import { BackwardOutlined, FlagOutlined, ForwardOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Progress, Radio, Row, Spin, Typography } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { Learner, Types } from '@adewaskar/lms-common';

import HtmlViewer from '@Components/HtmlViewer';
import dayjs from 'dayjs';
import useMessage from '@Hooks/useMessage';
import { useParams } from 'react-router'
import useQuestion from './hooks/useQuestion'
import { useTestItemTime } from '@User/Screens/Event/LiveSessionPlayer/User/useTestItemTime';
import useTestNavigation from '@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation';

const { Title, Text } = Typography

interface TestPlayeritemPropsI {}

export default function TestPlayeritem(props: TestPlayeritemPropsI) {
  const message = useMessage();
  const { questionId, testId } = useParams();
  useTestItemTime();
  const { currentQuestion, currentQuestionIndex, loading } = useQuestion();
  const [targetDate, setTargetDate] = useState('');
  const { mutate: submitAnswer,isLoading: submittingAnswer} = Learner.Queries.useSubmitTestAnswer();
  const OptionSelectedFormControl =
    currentQuestion.type === 'single' ? Radio : Checkbox;
  const [answersGiven, setAnswersGiven] = useState<string[]>([]);
  useEffect(() => {
    setTargetDate(dayjs().add(1.5, 'minute').toString());
  }, [questionId]);

  useEffect(() => {
    if (currentQuestion.answerGiven) {
      setAnswersGiven(currentQuestion.answerGiven)
    }
    else {
      setAnswersGiven([])
    }
  }, [currentQuestion]);
  const { data: test}=Learner.Queries.useGetTestDetails(testId+'')
  const {
    currentSectionIndex,
    currentQuestionIndex: currentQuestionIndexItemWide,
    navigate
  } = useTestNavigation(test);

  return (
    <Spin spinning={loading}>
      <div style={{ minHeight: '72vh' }}>
      <Row gutter={[20,30]}>
        <Col span={24}>
          <Row align={'middle'}>
            <Col flex={1}>
            <Title style={{margin:0}} level={5} type="secondary" >
            Question {currentQuestionIndex+1}
          </Title>
            </Col>
          </Row>
          <HtmlViewer content={ currentQuestion.title} ></HtmlViewer>

          {currentQuestion.type==='single'?<Text style={{ marginTop: 20,fontSize:16 }} type="secondary">
            Select one among others
          </Text>:<Text style={{ marginTop: 20,fontSize:18 }} type="secondary">
            Select all that apply
          </Text>}
        </Col>
        <Col span={24}>
          <Row gutter={[0,20]}>
            {currentQuestion.options.map((option: Types.TestQuestionOption, index: number) => {
              option = option || {};
              const optionId = option?._id + ''
              return (
                <Col span={24}>
                  <OptionSelectedFormControl
                    checked={answersGiven.indexOf(optionId) > -1}
                    onChange={e => {
                      let options = [...answersGiven]
                      const indexOfOption = options.indexOf(optionId)
                      if (e.target.checked) {
                        if (indexOfOption === -1) {
                          if (currentQuestion.type === 'single') {
                            options = [optionId]
                          } else {
                            options.push(optionId)
                          }
                        }
                      } else {
                        options.splice(indexOfOption, 1)
                      }
                      setAnswersGiven(options)
                    }}
                    style={{ marginLeft: 20 }}
                  >
                    <HtmlViewer content={ option.text} ></HtmlViewer>
                  </OptionSelectedFormControl>
                </Col>
              )
            })}
          </Row>
        </Col>  
      </Row>
      </div>
     
      <Row>
      <Col span={24}>
          <Row justify='space-between'>
            <Col>
            <Button         onClick={() => navigate('prev')}
        disabled={currentSectionIndex === 0 && currentQuestionIndexItemWide === 0}
 style={{marginRight:20}} icon={<BackwardOutlined/>}>Previous</Button>
              <Button
                    onClick={() => navigate('next')}
                    disabled={
                      currentSectionIndex === test.sections.length - 1 &&
                      currentQuestionIndexItemWide === test.sections[currentSectionIndex]?.items?.length - 1
                    }

                icon={<ForwardOutlined />}>Next</Button>
            </Col>
            <Col>
              <Col>
              <Button icon={<FlagOutlined/>} danger type='default'>Mark for review</Button>
        <Button loading={submittingAnswer} type='primary' style={{marginLeft:20,width: 110}} onClick={()=>{
          submitAnswer({
            testId:testId + '',
            questionId:questionId + '',
            answers: answersGiven
          }, {
            onSuccess: () => {
              message.open({
                type: 'success',
                content:'Answer Recorded'
              })
            }
          })
        }} disabled={!answersGiven.length}> Submit</Button>
        {/* <Button style={{width: 110}}> Skip</Button> */}
        </Col>
            </Col>
          </Row>
        </Col>
      </Row>
    </Spin>
  )
}
