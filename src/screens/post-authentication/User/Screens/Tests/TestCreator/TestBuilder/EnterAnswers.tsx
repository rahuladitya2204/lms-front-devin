import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Radio,
  Spin,
  Typography
} from 'antd'
import { Enum, Types } from '@adewaskar/lms-common'
import React, { Fragment, useEffect } from 'react'

import { useTestStore } from './hooks/useTestStore'

const { Title } = Typography

const EnterAnswers: React.FC = () => {
  const { test, updateItem, setTest } = useTestStore(s => s)
  const [form] = Form.useForm()

  useEffect(
    () => {
      form.setFieldsValue({ sections: test.sections })
    },
    [test]
  )
  // @ts-ignore

  const onFinish = values => {
    console.log(values, 'vals')
    // Update the test answers in the store
    const updatedTest = { ...test }
    // @ts-ignore
    values.sections.forEach((section, sectionIndex) => {
      // @ts-ignore
      section.items.forEach((item, itemIndex) => {
        let prevItem = updatedTest?.sections[sectionIndex]?.items[itemIndex]
        if (prevItem.type === 'numeric') {
          //  @ts-ignore
          prevItem.answer = { numeric: prevItem.answer }
        }
        if (prevItem.type === 'single') {
          //  @ts-ignore
          prevItem.options = prevItem.options.map(o => {
            if (item.answer.includes(o._id)) {
              o.isCorrect = true
            }
            return o
          })
        }
        if (prevItem.type === 'multiple') {
          //  @ts-ignore
          prevItem.answer = { options: prevItem.answer }
        }
        updatedTest.sections[sectionIndex].items[itemIndex] = {
          ...updatedTest.sections[sectionIndex].items[itemIndex]
          //   ...item
        }
      })
    })

    setTest(updatedTest)
    // Additional actions after saving, e.g., notifications
  }
  console.log(test, 'trer')
  const renderQuestionInput = (question: Types.TestQuestion) => {
    switch (question.type) {
      case 'single':
        return (
          <Radio.Group>
            {question.options.map((option,index) => (
              <Radio key={option._id} value={option._id}>{index+1}</Radio>
            ))}
          </Radio.Group>
        );
      case 'multiple':
        return (
          <Checkbox.Group>
            {/* {question.options.map((option,index) => (
              <Checkbox key={option._id} checked={!!option.isCorrect} value={option._id+''}>{index+1}</Checkbox>
            ))} */}
          </Checkbox.Group>
        );
      case 'numeric':
        return <Input type="number" />;
      case 'subjective':
        return <Input.TextArea />;
      default:
        return null;
    }
  };

  return (
    <Spin spinning={false}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.List name="sections">
          {(sectionFields) => (
            <>
              {sectionFields.map((sectionField, sectionIndex) => (
                <Card key={sectionField.key} title={<Title level={4}>{`Section ${sectionIndex + 1}`}</Title>}>
                  <Form.List name={[sectionField.name, 'items']}>
                    {(itemFields) => (
                      <>
                        {itemFields.map((itemField, itemIndex) => (
                          <Form.Item
                            key={itemField.key}
                            name={[itemField.name, 'answer']}
                            label={`Question ${itemIndex + 1}`}
                          >
                            {renderQuestionInput(test.sections[sectionIndex].items[itemIndex])}
                          </Form.Item>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
            </>
          )}
        </Form.List>
        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
          Save Answers
        </Button>
      </Form>
    </Spin>
  )
}

export default EnterAnswers
