import { Button, Col, Row, Tabs } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import ExternalVideo from './ExternalVideo'
import { Form } from 'react-router-dom'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
// @ts-nocheck
import MediaUpload from '@Components/MediaUpload'
import { getMetadata } from 'video-metadata-thumbnails'
import { render } from '@testing-library/react'
import { useParams } from 'react-router'

interface UploadVideoPropsI {
  prefixKey: string;
  onUpload: (d: Partial<Types.CourseSectionItem>) => void;
  item: Types.CourseSectionItem;
}

export default function UploadVideo(props: UploadVideoPropsI) {
  const { mutate: transcodeVideo } = User.Queries.useTranscodeVideo()
  const { id: courseId, sectionId, itemId } = useParams()
  return (
    <Tabs
      // onTabClick={e => {
      //   props.onUpload({
      //     file: null,
      //     external: {
      //       platform: e
      //     }
      //   })
      // }}
      defaultActiveKey="1"
      items={[
        {
          label: 'Upload',
          key: 'upload',
          children: (
            <Row>
              <Col span={24}>
                <MediaUpload
                  source={{
                    type: 'course.section.item.file',
                    value: courseId + ''
                  }}
                  prefixKey={props.prefixKey}
                  fileName={props.item.title}
                  isProtected
                  renderItem={() => (
                    <Button type="primary">Select Video</Button>
                  )}
                  onUpload={({ _id }, file) => {
                    // @ts-ignore
                    transcodeVideo({
                      fileId: _id
                    })
                    console.log(file, _id, 'fff')
                    getMetadata(file).then(r => {
                      props.onUpload({
                        file: _id,
                        metadata: {
                          duration: r.duration
                        }
                      })
                    })
                  }}
                  height="250px"
                  uploadType="video"
                />
                {/* {props?.item?.file ? (
                  <Form.Item label="Preview">
                    <MediaPlayer file={props.item.file} />
                  </Form.Item>
                ) : null} */}
              </Col>
            </Row>
          )
          // children: <UploadFile />
        },
        {
          label: 'Youtube',
          key: 'youtube',
          children: (
            <ExternalVideo
              onSubmit={d => {
                props.onUpload({
                  metadata: {
                    duration: 100
                  },
                  // @ts-ignore
                  file: null,
                  external: {
                    platform: 'youtube',
                    url: d.link
                  }
                })
              }}
              platform={{ label: 'Youtube', value: 'youtube' }}
            />
          )
        },
        {
          label: 'Vimeo',
          key: 'vimeo',
          children: (
            <ExternalVideo
              onSubmit={d => {
                props.onUpload({
                  metadata: {
                    duration: 100
                  },
                  // @ts-ignore
                  file: null,
                  external: {
                    platform: 'vimeo',
                    url: d.link
                  }
                })
              }}
              platform={{ label: 'Vimeo', value: 'vimeo' }}
            />
          )
        }
        // {
        //   label: 'Upload',
        //   key: 'sprout',
        //   children: (
        //     <ExternalVideo
        //       onSubmit={d => {
        //         props.onUpload({
        //           metadata: {
        //             duration: 100
        //           },
        //           file: null,
        //           external: {
        //             platform: 'sprout',
        //             url: d.link
        //           }
        //         })
        //       }}
        //       platform={{ label: 'Sprout', value: 'sprout' }}
        //     />
        //   )
        // }
      ]}
    />
  )
}
