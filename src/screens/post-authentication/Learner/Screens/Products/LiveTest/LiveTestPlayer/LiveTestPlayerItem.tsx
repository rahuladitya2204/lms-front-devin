import { Button, Checkbox, Col, Radio, Row, Typography } from 'antd'
import { Fragment, useState } from 'react'
import { useParams } from 'react-router'
import useQuestion from './hooks/useQuestion'
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography

interface LiveTestPlayeritemPropsI {}

export default function LiveTestPlayeritem(props: LiveTestPlayeritemPropsI) {
  const { currentQuestion } = useQuestion()
  const OptionSelectedFormControl =
    currentQuestion.type === 'single' ? Radio : Checkbox
  const [answersGiven, setAnswersGiven] = useState<number[]>([])
  return (
    <Fragment>
      <Row gutter={[20,30]}>
        <Col span={24}>
          <Text type="secondary" >
            Question 5
          </Text>
          <Title level={5}>{currentQuestion.title}</Title>

          {currentQuestion.type==='single'?<Text style={{ marginTop: 20,fontSize:16 }} type="secondary">
            Select one among others
          </Text>:<Text style={{ marginTop: 20,fontSize:18 }} type="secondary">
            Select all that apply
          </Text>}
        </Col>
        <Col span={24}>
          <Row gutter={[0,20]}>
            {currentQuestion.answers.map((answer: string, index: number) => {
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
                    <Text style={{fontSize: 19}}>{answer}</Text>
                  </OptionSelectedFormControl>
                </Col>
              )
            })}
          </Row>
        </Col>
        <Col flex={1} style={{display: 'flex',flexDirection:'row-reverse'}}>
        <Button type='primary' style={{marginLeft:20,width: 110}}> Submit</Button>
        <Button style={{width: 110}}> Skip</Button>
        </Col>
      </Row>
    </Fragment>
  )
}
