import { Button, Form, Input, message } from 'antd'
import React, { useState } from 'react'
import { Types, User } from '@adewaskar/lms-common'

export default function EnterQuestionJson(props: {
  itemId: string,
  testId: string
}) {
  const { itemId, testId } = props
  const [form] = Form.useForm()
  const [jsonValid, setJsonValid] = useState(true)
  const [validationError, setValidationError] = useState('')
  const { mutate: updateItemApi, isLoading } = User.Queries.useUpdateTestItem()

  const validateJSON = (jsonString: string): boolean => {
    let invalidFields: string[] = []
    try {
      const jsonObject: Types.TestQuestion = JSON.parse(jsonString)

      // Add checks for each field in the schema
      if (typeof jsonObject.title !== 'string') invalidFields.push('title')
      //   if (typeof jsonObject.score !== 'number') invalidFields.push('score');
      //   if (typeof jsonObject.isAiGenerated !== 'boolean') invalidFields.push('isAiGenerated');
      if (!Array.isArray(jsonObject.options)) {
        invalidFields.push('options')
      } else {
        jsonObject.options.forEach((option, index) => {
          if (typeof option.text !== 'string')
            invalidFields.push(`options[${index}].text`)
        })
      }
      if (!Array.isArray(jsonObject.topics)) {
        invalidFields.push('topics')
      } else {
        jsonObject.topics.forEach((topic, index) => {
          if (typeof topic.title !== 'string')
            invalidFields.push(`topics[${index}].title`)
        })
      }
      //   if (!['single', 'multiple', 'subjective'].includes(jsonObject.type)) invalidFields.push('type');

      // If there are invalid fields, set the validation message
      if (invalidFields.length > 0) {
        setValidationError(
          `Invalid or missing fields: ${invalidFields.join(', ')}`
        )
        return false
      }
      // Reset validation error if no invalid fields
      setValidationError('')
      return true
    } catch (e) {
      setValidationError('Invalid JSON format.')
      return false
    }
  }

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const isValid = validateJSON(event.target.value)
    setJsonValid(isValid)
    if (!isValid) {
      message.error(
        validationError || 'Invalid JSON format or missing required fields.'
      )
    }
  }

  const handleSubmit = () => {
    try {
      const values = form.getFieldsValue()
      const json = JSON.parse(values.jsonInput)
      console.log('Received JSON:', json)
      updateItemApi({
        testId: testId,
        itemId: itemId,
        data: json
      })
      // Process the JSON as required by your application...
    } catch (e) {
      message.error('Please enter valid JSON before submitting.')
    }
  }

  return (
    <React.Fragment>
      <Form layout="vertical" form={form}>
        <Form.Item
          name="jsonInput"
          rules={[
            {
              required: true,
              message: 'Please input the question JSON!'
            },
            () => ({
              validator(_, value) {
                if (!value || validateJSON(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(validationError))
              }
            })
          ]}
        >
          <Input.TextArea
            placeholder="Enter Question JSON"
            onChange={handleJsonChange}
            rows={4}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit} disabled={!jsonValid}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  )
}
