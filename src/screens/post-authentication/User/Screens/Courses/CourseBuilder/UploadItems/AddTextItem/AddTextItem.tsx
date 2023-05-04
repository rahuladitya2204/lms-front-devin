import { Avatar, Checkbox, Form, Input, Space } from 'antd'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
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
        <Form.Item label="Preview" tooltip="This is a preview item">
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

        <Form.Item label="Add Files" required>
          <Space direction="horizontal">
            <FileList
              userType="user"
              files={item.files}
              onDeleteFile={fileId => {
                // const files = item.files.filter(f => f.file !== fileId)
                // onFormChange({ files })
              }}
              uploadFileInput={
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
              }
            />
            <ActionModal
              cta={
                <Avatar
                  style={{ background: 'transparent' }}
                  shape="square"
                  size={80}
                  icon={<PlusOutlined />}
                />
              }
            >
              <MediaUpload
                uploadType="file"
                source={{
                  type: 'course.section.item/files',
                  value: courseId + ''
                }}
                isProtected
                onUpload={({ name, _id, isProtected }) => {
                  onFormChange({
                    files: [...item.files, { name, file: _id }]
                  })
                }}
              />
            </ActionModal>
          </Space>
        </Form.Item>
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
