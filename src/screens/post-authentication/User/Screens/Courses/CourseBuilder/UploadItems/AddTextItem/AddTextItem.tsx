import { Avatar, Button, Card, Checkbox, Form, Input, Space } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import MediaUpload from '@Components/MediaUpload'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import { Types } from '@adewaskar/lms-common'
import { getReadingTime } from '../../utils'
import { uniqueId } from 'lodash'
import useUploadItemForm from '../hooks/useUploadItemForm'

const AddTextItem: React.FC = () => {
  const [form] = Form.useForm()
  const { onFormChange, item, courseId, sectionId, itemId } = useUploadItemForm(
    form
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

        <Card
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
        <Form.Item name="description" label="Description" required>
          <SunEditorComponent
            // onChange={e => {
            //   onFormChange({
            //     description: e,
            //     metadata: {
            //       duration: readingTime(e)
            //     }
            //   })
            // }}
            name="description"
          />
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default AddTextItem
