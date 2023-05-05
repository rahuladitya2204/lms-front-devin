import { Button, Checkbox, Divider, Form, Input, Progress, Space, Typography } from 'antd'
import { Common, User } from '@adewaskar/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { debounce, uniqueId } from 'lodash'

import ActionModal from '@Components/ActionModal'
import FileList from '@Components/FileList'
import Image from '@Components/Image'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import ThumbnailList from './ThumbnailList'
import { getMetadata } from 'video-metadata-thumbnails'
import { getVideoThumbnails } from '../../utils'
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
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles();
  const [form] = Form.useForm();
  const { mutate: transcodeVideo } = User.Queries.useTranscodeVideo()
  const { id: courseId, sectionId, itemId } = useParams()
  const { onFormChange, item } = useUploadItemForm(form);
  
  const { data: file } = User.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  });

  const jobId = file?.metadata?.jobId;
  const {
    data: { status, progress }
  } = User.Queries.useGetTranscodeVideoStatus(jobId, {
    enabled: !!jobId,
    retry: true,
    retryDelay: 4000
  })


  const fileId = file.encoded || file._id;

  const uploadThumbnail = (file:File) => {
    uploadFiles({
      files: [
        {
          file: file,
          prefixKey: `courses/${courseId}/${sectionId}/${
            itemId
          }/lecture`,
          name: `thumbnailImage`,
          source: {
            type: 'course.section.item.file',
            value: courseId+''
          },
        }
      ],
      onUploadProgress: e => {
        // console.log(e, 'e')
      },
      onSuccess: ([uploadFile]) => {
        onFormChange({
          metadata: {
            ...item.metadata,
            thumbnail: uploadFile._id
          }
        })
      }
    })
  }
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
        {/* <Form.Item name="description" label="Description">
          <Input placeholder="Enter Description" />
        </Form.Item> */}
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
        <Form.Item label="Add Files" required>
          <Space direction="horizontal">
            <FileListStyled userType='user'
              onDeleteFile={(fileId:string) => {
                const files = item.files.filter(f => f.file !== fileId)
                onFormChange({ files })
              }}
              files={item.files}
              uploadFileInput={<MediaUpload
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
              />}
            />
          </Space>
        </Form.Item>{' '}
        <Form.Item name="context" label="Thumbnail" required>
        <MediaUpload width={'400'}
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
  <ThumbnailList item={item} fileId={file._id} />

</Form.Item>
        <Form.Item name="context" label="Preview" required>
          <MediaUpload
             source={{
              type: 'course.section.item.file',
              value: courseId+''
            }}
            prefixKey={`courses/${courseId}/${sectionId}/${
              itemId
            }/lecture/user-uploaded`}
            fileName={item.title}
            isProtected
            width="300px"
            onUpload={({ _id }, file) => {
              // @ts-ignore
              transcodeVideo({
                fileId: _id
              })
              getMetadata(file).then(r => {
                onFormChange({
                  file: _id,
                  metadata: {
                    duration: r.duration
                  }
                })
              })
            }}
            height="250px"
            uploadType="video"
            renderItem={() => (
              <Button>{file ? 'Replace Video' : 'Upload Video'}</Button>
            )}
          />

          {status === 'PROGRESSING' ? (
            <>
              <Title> Processing Video...</Title>
              <Progress percent={progress} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </>
          ) : null}
          {file._id ? <MediaPlayer fileId={fileId} /> : null}
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default UploadVideoForm
