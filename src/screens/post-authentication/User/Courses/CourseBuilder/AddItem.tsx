import { Button, Col, Form, Modal, Radio, Row, Space, Typography } from 'antd'
import { Fragment, useState } from 'react'

import { CourseNodeValueType } from '../../../../../types/Common.types'
import CreateHeading from './CreateNewItem/CreateHeading'
import CreateTextItem from './CreateNewItem/CreatTextItem'
import UploadFile from './UploadItems/UploadFile'
import UploadPDF from './UploadItems/UploadPDF'
import UploadVideo from './UploadItems/UploadVideo'
import styled from '@emotion/styled'

const { Title } = Typography

const UPLOAD_NEW_ITEM = [
  {
    title: 'PDF',
    description: 'Add a PDF file in the course.',
    component: UploadPDF,
    type: 'pdf'
  },
  {
    title: 'Video',
    description:
      'All uploaded videos are completely secure and non downloadable. It can also be used to embed youtube and Vimeo videos.',
    component: UploadVideo,
    type: 'video'
  },
  {
    title: 'File',
    description: 'Add any file type for learners to download.',
    component: UploadFile,
    type: 'file'
  }
]

const CREATE_NEW_ITEM = [
  // {
  //   title: 'Heading',
  //   description: 'Define your chapter or section headings.',
  //   component: CreateHeading,
  //   type:'heading'
  // },
  {
    title: 'Text',
    description:
      'Create your textual lessons in the course. It can also be used to embed iFrame, add HTML code through the Source option.',
    component: CreateTextItem,
    type: 'text'
  }
]

interface AddItemPropsI {
  onAddNewItem: (type: string, item: CourseNodeValueType, key?: string) => void;
  children?: React.ReactNode;
}

function AddItem(props: AddItemPropsI) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const [form] = Form.useForm()

  const onFinish = (type: string, item: CourseNodeValueType) => {
    props.onAddNewItem(type, item)
    closeModal()
  }
  return (
    <Fragment>
      <span onClick={showModal}>{props.children}</span>

      <Modal
        footer={false}
        style={{ minWidth: 750 }}
        title="Create Course"
        open={isModalOpen}
        onCancel={closeModal}
      >
        <Form form={form} layout="vertical">
          <Radio.Group>
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <Title level={4}>Upload new Item</Title>
                <Space direction="vertical" size={[20, 20]}>
                  {UPLOAD_NEW_ITEM.map(item => {
                    const Component = item.component
                    return (
                      <Space>
                        <Component
                          onFinish={e => {
                            onFinish(item.type, e)
                          }}
                        >
                          {' '}
                          <Radio value={item.type}>
                            {' '}
                            <Typography.Text strong>
                              {item.title}:
                            </Typography.Text>{' '}
                            {item.description}
                          </Radio>
                        </Component>
                      </Space>
                    )
                  })}
                </Space>
              </Col>
              <Col span={12}>
                <Title level={4}>Create New Item</Title>
                <Space direction="vertical">
                  {CREATE_NEW_ITEM.map(item => {
                    const Component = item.component
                    return (
                      <Space direction="vertical" size={[20, 20]}>
                        <Component
                          onFinish={e => {
                            onFinish(item.type, e)
                          }}
                        >
                          {' '}
                          <Radio value={item.type}>
                            {' '}
                            <Typography.Text strong>
                              {item.title}:
                            </Typography.Text>{' '}
                            {item.description}
                          </Radio>
                        </Component>
                      </Space>
                    )
                  })}
                </Space>
              </Col>
            </Row>
          </Radio.Group>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default AddItem
