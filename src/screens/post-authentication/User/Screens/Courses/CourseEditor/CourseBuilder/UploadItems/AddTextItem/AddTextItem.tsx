import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  Switch
} from 'antd'
import { Fragment, useEffect } from 'react'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Types, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal'
import { AddItemProps } from '../UploadPDF'
import FileList from '@Components/FileList'
import InputTags from '@Components/InputTags/InputTags'
import MediaUpload from '@Components/MediaUpload'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import TextArea from '@Components/Textarea'
import { getReadingTime } from '../../utils'
import { uniqueId } from 'lodash'
import useUploadItemForm from '../hooks/useUploadItemForm'

const AddTextItem: React.FC<AddItemProps> = props => {
  const [form] = Form.useForm()
  const {
    onFormChange,
    topics,
    handleTopicsChange,
    item,
    courseId,
    sectionId,
    itemId
  } = useUploadItemForm(form)

  const {
    data: summary,
    mutate: generateInfoApi,
    isLoading: generatingSummary
  } = User.Queries.useGenerateCourseItemInfo()
  const generateItemInfo = (fields: Types.LooseObject) => {
    generateInfoApi(
      { data: { courseId: courseId + '', itemId: itemId + '', fields } },
      {
        onSuccess: ({ summary, topics }) => {
          if (summary) {
            onFormChange({ summary: summary })
          }
          if (topics && topics.length) {
            handleTopicsChange(topics)
          }
          console.log(topics, '123123')
          // form.setFieldValue('summary', summary);
        }
      }
    )
  }

  return (
    <Fragment>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={e => {
          const data: Partial<Types.CourseSectionItem> = {
            ...e
          }
          if (e.description) {
            data.metadata = {
              duration: getReadingTime(e.description)
            }
          }
          onFormChange(data)
        }}
      >
        <Form.Item name="title" label="Title" required>
          <Input placeholder="Enter Text Content's title" />
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={item.isPreview}
            onChange={e => {
              const isPreview = e.target.checked
              onFormChange({ isPreview })
            }}
          >
            Avail this as a free lecture
          </Checkbox>
        </Form.Item>
        <Form.Item
          name="topics"
          label={
            <span>
              Topics{' '}
              <Button
                loading={generatingSummary}
                onClick={() => generateItemInfo({ topics: 1 })}
                type="primary"
                size="small"
              >
                Generate
              </Button>
            </span>
          }
          rules={[{ required: true, message: 'Please input your topics!' }]}
        >
          <InputTags
            name="topics"
            onChange={handleTopicsChange}
            ctaText="Enter Topics"
          />{' '}
          {/* MODIFIED */}
        </Form.Item>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card
              style={{ marginBottom: 20 }}
              title="Course Files"
              extra={
                <ActionModal
                  cta={<Button icon={<UploadOutlined />}> Upload Files</Button>}
                >
                  <MediaUpload
                    source={{
                      type: 'course.section.item.files',
                      value: courseId + ''
                    }}
                    uploadType="file"
                    prefixKey={`courses/${courseId}/${sectionId}/${
                      itemId
                    }/files/${uniqueId()}`}
                    onUpload={({ name, _id }) => {
                      onFormChange({
                        files: [...item.files, { name, file: _id }]
                      })
                    }}
                  />
                </ActionModal>
              }
            >
              <FileList
                userType="user"
                onDeleteFile={(fileId: string) => {
                  const files = item.files.filter((f: any) => f.file !== fileId)
                  onFormChange({ files })
                }}
                files={item.files}
              />
            </Card>
          </Col>
        </Row>
        <Form.Item name="description" label="Description">
          <SunEditorComponent />
        </Form.Item>

        {item.description ? (
          <Form.Item
            name={'summary'}
            label={
              <span>
                Summary{' '}
                <Button
                  loading={generatingSummary}
                  onClick={() =>
                    generateItemInfo({
                      summary: 1
                    })
                  }
                  type="primary"
                  size="small"
                >
                  Generate with AI
                </Button>
              </span>
            }
            required
          >
            <SunEditorComponent height={300} name={'summary'} />
          </Form.Item>
        ) : null}

        <Form.Item
          label={
            <span>
              Topics{' '}
              <Button
                loading={generatingSummary}
                onClick={() => generateItemInfo({ topics: 1 })}
                type="primary"
                size="small"
              >
                Generate with AI
              </Button>
            </span>
          }
          required
          tooltip="This is a required field"
        >
          <InputTags name="topics" ctaText="Enter Topics" />
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default AddTextItem
