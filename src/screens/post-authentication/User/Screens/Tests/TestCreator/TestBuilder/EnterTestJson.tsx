import { Button, Form, Input, message } from 'antd'
import React, { useState } from 'react'
import { Types, User } from '@adewaskar/lms-common'

export default function EnterTestJson(props: { testId: string }) {
  const { testId } = props
  const [form] = Form.useForm()
  const [jsonValid, setJsonValid] = useState(true)
  const [validationError, setValidationError] = useState('')
  const { mutate: updateTestApi, isLoading } = User.Queries.useUpdateTest()

  const validateJSON = (jsonString: string): boolean => {
    let invalidFields: string[] = []
    try {
      const jsonObject: Types.Test = JSON.parse(jsonString)

      // Add checks for each field in the sections array
      if (!Array.isArray(jsonObject.sections)) {
        invalidFields.push('sections')
      } else {
        jsonObject.sections.forEach((section, sIndex) => {
          if (typeof section.title !== 'string')
            invalidFields.push(`sections[${sIndex}].title`)

          // Add other validations per your schema requirements
        })
      }

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
      updateTestApi({
        id: testId,
        data: {
          sections: json.sections
        } // Assuming your API expects 'sections' key
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
              message: 'Please input the test sections JSON!'
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
            placeholder="Enter Test Sections JSON"
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
