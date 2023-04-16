import { Button, Form, Input } from 'antd'

import { Common } from '@adewaskar/lms-common'
import { Fragment } from 'react'
import MediaUpload from '@Components/MediaUpload'
import PDFViewer from '@Components/PDFViewer'
import useUploadItemForm from '../hooks/useUploadItemForm'

const UploadPDFForm: React.FC = () => {
  const { onFormChange, form, item } = useUploadItemForm();
  const { data: file } = Common.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  return (
    <Fragment>
      <Form
        onValuesChange={onFormChange}
        form={form}
        layout="vertical"
        initialValues={{ title: '', description: '' }}
      >
        <Form.Item
          name="title"
          label="Title"
          required
          tooltip="This is a required field"
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item name="Description" label="Description" required>
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item name="PDF File" label="PDF File" required>
          <MediaUpload
            isProtected
            width="300px"
            onUpload={({ _id }) => {
              onFormChange({
                file: _id,
                type: 'pdf'
              })
            }}
            height="250px"
            renderItem={() => (
              <Button>
                {file?.url ? 'Replace PDF' : 'Upload PDF'}
              </Button>
            )}
          />
          {file?.url ? (
            <PDFViewer url={file?.url + ''} />
          ) : null}
        </Form.Item>
      </Form>
      {/* <PDFViewer url={data.url} /> */}
    </Fragment>
  )
}

export default UploadPDFForm
