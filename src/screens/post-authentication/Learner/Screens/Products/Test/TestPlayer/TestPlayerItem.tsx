import { Button, Checkbox, Col, Progress, Radio, Row, Spin, Typography } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { Learner, Types } from '@adewaskar/lms-common';

import HtmlViewer from '@Components/HtmlViewer';
import dayjs from 'dayjs';
import { useParams } from 'react-router'
import useQuestion from './hooks/useQuestion'
import { useTestItemTime } from '@User/Screens/Event/LiveSessionPlayer/User/useTestItemTime';

const { Title, Text } = Typography

interface TestPlayeritemPropsI {}

export default function TestPlayeritem(props: TestPlayeritemPropsI) {
  const { questionId, testId } = useParams();
  useTestItemTime();
  const { currentQuestion, currentQuestionIndex, loading } = useQuestion();
  const [targetDate, setTargetDate] = useState('');
  const { mutate: submitAnswer,isLoading: submittingAnswer} = Learner.Queries.useSubmitTestAnswer();
  const OptionSelectedFormControl =
    currentQuestion.type === 'single' ? Radio : Checkbox;
  const [answersGiven, setAnswersGiven] = useState<number[]>([]);
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
  },[currentQuestion])
  return (
    <Spin spinning={loading}>
      <Row gutter={[20,30]}>
        <Col span={24}>
          <Row align={'middle'}>
            {/* <Col>
              <Progress style={{ marginRight: 20 }}
                type="circle"
                width={50}
                percent={100}
                format={() => <Text strong><Countdown hideHour targetDate={targetDate} /></Text>} />
            </Col> */}
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
              return (
                <Col span={24}>
                  <OptionSelectedFormControl
                    checked={answersGiven.indexOf(index) > -1}
                    onChange={e => {
                      let options: number[] = [...answersGiven]
                      const indexOfOption = options.indexOf(index)
                      if (e.target.checked) {
                        if (indexOfOption === -1) {
                          if (currentQuestion.type === 'single') {
                            options = [index]
                          } else {
                            options.push(index)
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
        <Col flex={1} style={{display: 'flex',flexDirection:'row-reverse'}}>
        <Button loading={submittingAnswer} type='primary' style={{marginLeft:20,width: 110}} onClick={()=>{
          submitAnswer({
            testId:testId + '',
            questionId:questionId + '',
            answers: answersGiven
          }, {
            onSuccess: () => {
              
            }
          })
        }} disabled={!answersGiven.length}> Submit</Button>
        <Button style={{width: 110}}> Skip</Button>
        </Col>
      </Row>
    </Spin>
  )
}
