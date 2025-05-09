// @ts-nocheck
import { Card, Checkbox, Col, List, Radio, Row } from 'antd'
import { Enum, Types } from '@adewaskar/lms-common'

import React from 'react'
import { Typography } from '@Components/Typography';
import { useOutletContext } from 'react-router';

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
  const [, , language] = useOutletContext();
  return (
    <div style={{ margin: 30 }}>
      <Typography.Text strong> {question?.title.text[language] || ''}</Typography.Text>
      <List
        bordered
        size="large"
        style={{ marginTop: 20 }}
        dataSource={question.options}
        renderItem={(item, index) => (
          <List.Item>
            {question.type === Enum.TestQuestionType.SINGLE ? (
              <Radio.Group
                disabled={isAnswerChecked}
                onChange={e => saveAnswerByLearner(index)}
                // @ts-ignore
                value={answerGiven && answerGiven[0]}
              >
                <List.Item.Meta
                  avatar={<Radio value={index}>{item.text[language]}</Radio>}
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
                  avatar={<Checkbox value={index}>{item.text[language]}</Checkbox>}
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
