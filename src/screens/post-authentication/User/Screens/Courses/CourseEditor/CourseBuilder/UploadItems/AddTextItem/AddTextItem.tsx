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

import ActionModal from '@Components/ActionModal'
import { AddItemProps } from '../UploadPDF'
import FileList from '@Components/FileList'
import MediaUpload from '@Components/MediaUpload'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'
import { getReadingTime } from '../../utils'
import { uniqueId } from 'lodash'
import useUploadItemForm from '../hooks/useUploadItemForm'

const AddTextItem: React.FC<AddItemProps> = (props) => {
  const [form] = Form.useForm()
  const { onFormChange, item, courseId, sectionId, itemId } = useUploadItemForm(
    form
  )

  useEffect(
    () => {
      if (props.item) {
        form.setFieldsValue({
          title: props.item.title
        })
      }
    },
    [props.item, form]
  )

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
                  const files = item.files.filter(f => f.file !== fileId)
                  onFormChange({ files })
                }}
                files={item.files}
              />
            </Card>
          </Col>
        </Row>
        <TextArea label="Description" name="description" />
      </Form>
    </Fragment>
  )
}

export default AddTextItem
