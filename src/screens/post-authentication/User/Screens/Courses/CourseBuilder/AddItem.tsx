import { Col, Divider, Form, Modal, Radio, Row, Space, Typography } from 'antd'

import ActionModal from '@Components/ActionModal'
import CreateTextItem from './CreateNewItem/CreatTextItem'
import { Types } from '@adewaskar/lms-common'
import UploadPDF from './UploadItems/UploadPDF'
import UploadVideo from './UploadItems/UploadVideo'
import { extend } from 'lodash'

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
  }
]

const CREATE_NEW_ITEM = [
  {
    title: 'Text',
    description:
      'Create your textual lessons in the course. It can also be used to embed iFrame, add HTML code through the Source option.',
    component: CreateTextItem,
    type: 'text'
  }
]

interface AddItemPropsI {
  onAddNewItem: (
    type: string,
    item: Partial<Types.CourseSectionItem>,
    key?: string
  ) => void;
  children?: React.ReactNode;
  closeModal?: () => void;
  item?: Partial<Types.CourseSectionItem>;
}

function AddItem(props: AddItemPropsI) {
  const [form] = Form.useForm()
  const onFinish = (type: string, item: Partial<Types.CourseSectionItem>) => {
    props.onAddNewItem(type, extend(props.item, item))
    props.closeModal && props.closeModal()
  }
  return (
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
                    <ActionModal
                      cta={
                        <Radio value={item.type}>
                          {' '}
                          <Typography.Text strong>
                            {item.title}:
                          </Typography.Text>{' '}
                          {item.description}
                        </Radio>
                      }
                    >
                      <Component
                        item={props.item}
                        onFinish={(e: any) => {
                          onFinish(item.type, { ...props.item, ...e })
                        }}
                      />
                    </ActionModal>
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
                    <ActionModal
                      cta={
                        <Radio value={item.type}>
                          {' '}
                          <Typography.Text strong>
                            {item.title}:
                          </Typography.Text>{' '}
                          {item.description}
                        </Radio>
                      }
                    >
                      <Component
                        // @ts-ignore
                        item={props.item}
                        onFinish={e => {
                          onFinish(item.type, { ...props.item, ...e })
                        }}
                      />
                    </ActionModal>
                  </Space>
                )
              })}
            </Space>
          </Col>
        </Row>
      </Radio.Group>
    </Form>
  )
}

export default AddItem
