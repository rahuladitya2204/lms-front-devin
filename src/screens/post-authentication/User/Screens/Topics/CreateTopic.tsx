import { Button, Form, Input, Select } from 'antd'
import React, { Fragment, ReactNode, useEffect } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateTopicComponentPropsI {
  children?: ReactNode;
  parentId?: string;
  data?: Types.Topic;
  closeModal?: Function;
  onFinish?: (data: Types.Topic) => void;
}

const AddTopic: React.FC<CreateTopicComponentPropsI> = props => {
  const {
    mutate: createTopic,
    isLoading: createTopicLoading
  } = User.Queries.useCreateTopic()
  const {
    mutate: updateTopic,
    isLoading: updateTopicLoading
  } = User.Queries.useUpdateTopic()

  const { listItems: topics } = User.Queries.useGetTopics()

  const [form] = Form.useForm()

  const onSubmit = (e: Partial<Types.Topic>) => {
    if (props.data) {
      updateTopic(
        // @ts-ignore
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            form.resetFields()
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createTopic(
        // @ts-ignore
        { data: e },
        {
          onSuccess: () => {
            form.resetFields()
            props.closeModal && props.closeModal()
          }
        }
      )
    }
    // onFinish && onFinish(e)
  }

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  useEffect(
    () => {
      form.setFieldValue(['parentId'], props.parentId)
    },
    [props.parentId]
  )

  return (
    <Fragment>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="parentId" label="Parent Topic" required>
          <Select
            placeholder="Select Parent Topic"
            // defaultValue="lucy"
            style={{ width: '100%' }}
            // onChange={handleChange}
            options={topics}
          />
        </Form.Item>
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Topic Title" />
        </Form.Item>
      </Form>
      {/* <Button
        key="back"
        onClick={() => form.resetFields(['TopicName', 'title'])}
      >
        Clear
      </Button>, */}
      <Button
        loading={createTopicLoading || updateTopicLoading}
        key="submit"
        type="primary"
        htmlType="submit"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Fragment>
  )
}

export default AddTopic
