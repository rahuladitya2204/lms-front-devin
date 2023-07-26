import { Button, Card, Checkbox, Col, Divider, Empty, Form, Input, Progress, Row, Space, Typography } from 'antd'
import { Common, User } from '@adewaskar/lms-common'
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { debounce, uniqueId } from 'lodash'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import { Fragment } from 'react'
import Image from '@Components/Image'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import ThumbnailList from './ThumbnailList'
import styled from '@emotion/styled'
import { useParams } from 'react-router'
import useUploadItemForm from '../hooks/useUploadItemForm'
import UploadVideo from './UploadVideoPopup/UploadVideo'
import { getMetadata } from 'video-metadata-thumbnails'

const { Title } = Typography

const FileListStyled=styled(FileList)`
    /* ul.ant-list-items{
      display: flex !important;
    } */
`

const UploadVideoForm:any = () => {
  const [form] = Form.useForm();
  const { id: courseId, sectionId, itemId } = useParams()
  const { onFormChange, item } = useUploadItemForm(form);
  
  const { data: file } = User.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  });

  const jobId = file?.metadata?.jobId;
  const {
    data: { status, progress }
  } = User.Queries.useGetTranscodeVideoStatus(jobId, {
    retry: true,
    enabled:!!item.file,
    retryDelay: 4000
  })
  const fileId = file.encoded || file._id;
  return (
    <Fragment>
      <Form onValuesChange={debounce(onFormChange,700)} form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          required
          tooltip="This is a required field"
        >
          <Input placeholder="Enter Video Title" />
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
        <Row gutter={[20,20]}>
         
          <Col span={24}>
        <Card style={{marginTop:20}} title='Video File' extra={[  <ActionModal cta={<Button icon={<UploadOutlined />}>{(file._id || item.external?.url) ? 'Replace video' : 'Upload Lecture'}</Button>}>
          <UploadVideo item={item} onUpload={(item) => {
              onFormChange(item)
            }
          
                } />
              </ActionModal>]}>
             {file._id?<> <div style={{marginBottom:20}}>
              <ThumbnailList item={item} fileId={file._id} />
 </div>

<Form.Item label='Thumbnail'>
<MediaUpload width={'200'}
                source={{
                  type: 'course.section.item.thumbnail',
                  value: courseId+''
                }}
                uploadType="image"
                prefixKey={`courses/${courseId}/${sectionId}/${
                  itemId
                }/thumbnail}`}
                onUpload={({ name, _id,url }) => {
                  onFormChange({
                    metadata: {
                      ...item.metadata,
                      thumbnail: url
                    }
                  })
                }}
                renderItem={() => (
                  <Image preview={false} src={item.metadata?.thumbnail} />
                )}
            />
</Form.Item></>:null}


          {status === 'PROGRESSING' ? (
            <>
              <Title level={3} style={{marginTop:0}}> Processing Video...</Title>
              <Progress style={{marginBottom:20}} percent={progress} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </>
          ) : null}
              {file._id ? <MediaPlayer thumbnail={item.metadata?.thumbnail} fileId={fileId} /> : (item.external?.url?<MediaPlayer platform={item.external.platform} url={item.external.url} />:<Empty description='No Video Uploaded'  />)}
            </Card>
          </Col>

          <Col span={24}>
          <Card title='Extra Resources' extra={<ActionModal cta={<Button icon={<UploadOutlined/> }> Upload Files</Button>}>
            <MediaUpload
                source={{
                  type: 'course.section.item.files',
                  value: courseId+''
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
          </ActionModal>}>
          <FileListStyled userType='user'
              onDeleteFile={(fileId:string) => {
                const files = item.files.filter(f => f.file !== fileId)
                onFormChange({ files })
              }}
              files={item.files}
            />
            </Card>
          </Col>
        </Row>
      </Form>
    </Fragment>
  )
}

export default UploadVideoForm
