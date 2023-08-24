import { Button, Card, Checkbox, Col, Divider, Empty, Form, Input, Progress, Row, Space, Typography } from 'antd'
import { Common, Types, User } from '@adewaskar/lms-common'
import { Fragment, useEffect } from 'react'
import { UploadOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { debounce, uniqueId } from 'lodash'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import Image from '@Components/Image'
import InputTags from '@Components/InputTags/InputTags'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import SunEditorComponent from '@Components/SunEditor/SunEditor'
import TextArea from '@Components/Textarea'
import ThumbnailList from './ThumbnailList'
import UploadVideo from './UploadVideoPopup/UploadVideo'
import { getMetadata } from 'video-metadata-thumbnails'
import styled from '@emotion/styled'
import { useParams } from 'react-router'
import useUploadItemForm from '../hooks/useUploadItemForm'

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
  const { data: topics } = User.Queries.useGetTopics();
  const videoJobId = file?.metadata?.video?.jobId;
  const {
    data: transcoding
  } = User.Queries.useGetTranscodeVideoStatus(videoJobId, {
    retry: true,
    enabled:!!videoJobId,
    retryDelay: 1000
  });

  const transcribeJobId = file?.metadata?.transcribe?.jobId;
  const {
    data: transcribing
  } = User.Queries.useGetTranscribeVideoStatus(transcribeJobId, {
    retry: true,
    enabled:!!transcribeJobId,
    retryDelay: 1000
  });

  const {  mutate: generateItemInfoApi, isLoading: generatingSummary } = User.Queries.useGenerateCourseItemInfo();

  const generateItemInfo = (fields: Types.LooseObject) => {
    generateItemInfoApi({ data: { courseId:courseId+'', itemId:itemId+'' ,fields} }, {
      onSuccess: ({ summary, topics }) => {
        if (summary) {
          onFormChange({ summary: summary });
        }
        if (topics&&topics.length) {
          onFormChange({ topics: topics });
        }
        console.log(topics,'123123')
        // form.setFieldValue('summary', summary);
      }
    });
  }

  useEffect(() => { 
    form.setFieldsValue(item);
  },[item])

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
        <Form.Item
        name="topics"
        label="Topics"
        rules={[{ required: true, message: "Please input your topics!" }]}
      >
       <InputTags name="topics" onChange={(v)=>onFormChange({topics:v})} ctaText='Enter Topics'/>
                </Form.Item>
        <Row gutter={[20,20]}>
         
          <Col span={24}>
        <Card style={{marginTop:20}} title='Lecture Video' extra={[  <ActionModal cta={<Button icon={<UploadOutlined />}>{(file._id || item.external?.url) ? 'Replace video' : 'Upload Lecture'}</Button>}>
          <UploadVideo prefixKey={`courses/${courseId}/${
                    itemId
                  }/lecture/index`} item={item} onUpload={(item) => {
            // console.log(item,'item')
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


            <Row>
            {transcoding.status === 'PROGRESSING' ? (
<Col span={24}>
              <Progress format={()=>`Processing Video`} style={{marginBottom:20}} percent={transcoding.progress} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
                  </Col>          ) : null}

                {transcribing.status === 'PROGRESSING' ? (
                  <Col span={24}>
                    <Progress format={() => `Generating Trancripts`} style={{ marginBottom: 20 }} percent={transcribing.progress} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
                  </Col>) : null}
              </Row>
              {file._id ? <MediaPlayer thumbnail={item.metadata?.thumbnail} fileId={fileId} /> : (item.external?.url ? <MediaPlayer platform={item.external.platform} url={item.external.url} /> : <Empty description='No Video Uploaded' />)}
              
             {file.transcription?<> <Divider/>
              <Form.Item name={'summary'}
                  label={<span>Summary <Button loading={generatingSummary} onClick={() => generateItemInfo({ summary: 1 })} type='primary' size='small'>Generate</Button></span>}
          required
        >
          <SunEditorComponent height={300} name={'summary'} />
                </Form.Item>
                </> : null}
           
               
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
                const files = item.files.filter((f:any) => f.file !== fileId)
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
