import { Form } from 'antd'
import { useEffect } from 'react'

function useForm<T>(initialValues: any) {
    const [form] = Form.useForm<T>();

  useEffect(
    () => {
      form.setFieldsValue(initialValues)
    },
    [initialValues]
  )

  return form
}

export default useForm
