import { Card, Checkbox, Col, List, Radio, Row, Typography } from 'antd'

import React from 'react'
import { Types } from '@adewaskar/lms-common'

interface CoursePlayerItemsPropsI {
  question: Types.TestQuestion;
  isAnswerChecked: boolean;
  answerGiven: number;
  saveAnswerByLearner: (answerIndex: number) => void;
}

const CourseQuestionStep: React.FC<CoursePlayerItemsPropsI> = ({
  question,
  isAnswerChecked,
  answerGiven,
  saveAnswerByLearner
}) => {
  return (
    <div style={{ margin: 30 }}>
      <Typography.Text strong> {question?.title || ''}</Typography.Text>
      <List
        bordered
        size="large"
        style={{ marginTop: 20 }}
        dataSource={question.options}
        renderItem={(item, index) => (
          <List.Item>
            {question.type === 'single' ? (
              <Radio.Group
                disabled={isAnswerChecked}
                onChange={e => saveAnswerByLearner(index)}
                // @ts-ignore
                value={answerGiven && answerGiven[0]}
              >
                <List.Item.Meta
                  avatar={<Radio value={index}>{item.text}</Radio>}
                />
              </Radio.Group>
            ) : (
              <Checkbox.Group
                disabled={isAnswerChecked}
                onChange={e => saveAnswerByLearner(index)}
                // @ts-ignore
                value={answerGiven}
              >
                <List.Item.Meta
                  avatar={<Checkbox value={index}>{item.text}</Checkbox>}
                />
              </Checkbox.Group>
            )}
          </List.Item>
        )}
      />
    </div>
  )
}

export default CourseQuestionStep
