import { Button, Checkbox, Form, Input, Modal, Progress, Space, Spin } from 'antd'
import { Common, Types, User } from '@invinciblezealorg/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { debounce, uniqueId } from 'lodash'

import FileList from '@Components/FileList'
import Image from '@Components/Image'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import MediaUpload from '@Components/MediaUpload'
import { getMetadata } from 'video-metadata-thumbnails'
import { getVideoThumbnails } from '../../utils'
import styled from '@emotion/styled'
import { useParams } from 'react-router'
import useUploadItemForm from '../hooks/useUploadItemForm'

interface ThumbnailListPropsI {
    item: Types.CourseSectionItem;
    fileId: string;
}

const { confirm } = Modal;

const ThumbnailList: any = (props: ThumbnailListPropsI) => {
    const [generating, setGenerating] = useState(false);
  const { item, fileId } = props;
    const { data: url } = Common.Queries.useGetPresignedUrlFromFile(fileId, {
        enabled:!!fileId
      });
  const {
    mutate: uploadFiles,
    isLoading: uploading
  } = Common.Queries.useUploadFiles();
    
    const { id: courseId, sectionId, itemId } = useParams();
    const { onFormChange } = useUploadItemForm()

    const [thumbnails, setThumbnails] = useState<{ url: string; file: File }[]>([]);
    
    const generateThumbnails = (url:string) => {
        setGenerating(true)
        getVideoThumbnails(url).then(blobs => {
          console.log(blobs,'blobs')
          const files = blobs.map((blob, index) => {
            return {
              file: new File([blob], `thumbnail-${index}.jpeg`, { type: 'image/jpeg' }),
              url: URL.createObjectURL(blob)
            }
          });
          setThumbnails(files);
        }).catch(console.log).finally(()=> {
          setGenerating(false)
        });
        return () => {
          setThumbnails([]);
        }
    }
    
//   useEffect(() => {
//       if (item.metadata?.duration && url) {
//           generateThumbnails(url);
//         }
    
//   }, []);

    const uploadThumbnail = (file: File) => {
        confirm({
            title: 'Are you sure?',
            // icon: <ExclamationCircleOutlined />,
            content: `You want to set this as thumbnail`,
            onOk() {
              uploadFiles({
                    files: [
                      {
                        file: file,
                        prefixKey: `courses/${courseId}/${sectionId}/${
                          itemId
                        }/lecture/thumbnail`,
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
                          thumbnail: uploadFile.url
                        }
                      })
                    }
                  })
            },
            okText: 'Set as thumbnail'
          })
   
    }
    
    const spinText = generating ? 'Generating Thumbnails..' : (uploading ? 'Uploading Thumbnail..' : null);
  return (
      <>
          <Button size='small' loading={generating} type='primary' style={{marginBottom:20}} onClick={()=>generateThumbnails(url)}>Generate Thumbnails</Button>
       <Spin spinning={ uploading} tip={spinText}>
          <Space size={[10,20]}>
              {thumbnails.map(({file,url} )=> {
            return <Space direction='vertical'>
              <Image preview width={200} height={100} src={url} />
              <Button size='small' onClick={() => uploadThumbnail(file)}>Select as thumbnail</Button>
            </Space>
          })}
    </Space>
    </Spin></>
      
  )
}

export default ThumbnailList
