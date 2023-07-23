// @ts-nocheck

import React from 'react'
import { Card, Checkbox, Col, List, Radio, Row, Typography } from 'antd'
import Stepper from '@Components/Stepper'
import { Types } from '@adewaskar/lms-common'

interface CoursePlayerItemsPropsI {
  question: Types.CourseQuizQuestion;
  answerGivenIndex: number;
  saveAnswerByLearner: (answerIndex: number) => void;
}

const CourseQuestionStep: React.FC<CoursePlayerItemsPropsI> = ({
  question,
  answerGivenIndex,
  saveAnswerByLearner
}) => {
  return (
    <div style={{ margin: 30, overflow: 'scroll', height: '100%' }}>
      <Typography.Text strong> {question?.title || ''}</Typography.Text>
      <List
        size="large"
        // bordered
        style={{ marginTop: 20 }}
        dataSource={question.answers}
        // extra={<Radio />}
        renderItem={(item, index) => (
          <List.Item>
            <Radio.Group
              onChange={e => saveAnswerByLearner(e.target.value)}
              value={answerGivenIndex}
            >
              <List.Item.Meta avatar={<Radio value={index}>{item}</Radio>} />
            </Radio.Group>
          </List.Item>
        )}
      />
    </div>
  )
}

export default CourseQuestionStep
