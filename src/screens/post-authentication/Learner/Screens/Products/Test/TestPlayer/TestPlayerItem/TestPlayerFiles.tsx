import { Alert, Button, Card, Col, Empty, Form, FormInstance, Image, Modal, Row, Space, Spin, Tooltip, message } from 'antd'
import { AppCamera, useCamera } from '@Components/ActionModal/Camera/AppCamera'
import { Common, Learner, Types } from '@invinciblezealorg/lms-common'
import { DeleteOutlined, EditFilled, EditOutlined, EditTwoTone, UploadOutlined, WarningOutlined } from '@ant-design/icons'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
// TestPlayerFiles.tsx
import React, { Fragment, useCallback } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import AppImage from '@Components/Image'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MediaUpload from '@Components/MediaUpload'
import { MovableItem } from '@Components/DragAndDrop/MovableItem'
import { Typography } from '@Components/Typography'
import update from 'immutability-helper'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useReviewQuestion } from '../../TestReview/TestPlayerItemReview'

const {Text}=Typography;

const { confirm } = Modal;
const TestPlayerFiles = (props: { testId: string, questionId: string, review?: boolean }) => {
  const { mutate: updateAnswer,isLoading: updatingAnswer } = Learner.Queries.useUpdateTestAnswer(props.testId);
  const form = Form.useFormInstance<Types.TestAnswer>();
  const message = useMessage();
  const files = Form.useWatch(['answer', 'subjective', 'files'], form) || [];
    // @ts-ignore
  const handleUpload = (file) => {
    const FILES = [...files, ...file];
    // add(file)
    form.setFieldValue(['answer', 'subjective', 'files'], FILES);
    updateAnswerApi()
  }
  const updateAnswerApi = (isRearrange?:boolean) => {
    const answer = form.getFieldValue(['answer']);
    updateAnswer({
      testId: props.testId + '',
      questionId: props.questionId + '',
      answer: answer,
    }, {
      onSuccess: () => {
        message.open({
          type: 'success',
          content: isRearrange?'File rearranged successfully':'File uploaded successfully'
        })
      }
    });
  }
  const handleMoveItem = (dragIndex:number, hoverIndex: number) => {
    // Update the order of files in the form
    form.setFieldsValue({
      answer: {
        subjective: {
          files: update(form.getFieldValue(['answer', 'subjective', 'files']), {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, form.getFieldValue(['answer', 'subjective', 'files'])[dragIndex]],
            ],
          }),
        },
      },
    });
    updateAnswerApi(true)
  };

  const deleteFile = (fileId:string) => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this file`,
      onOk() {
        const updatedFiles = files.filter(f => f.file !== fileId);
        form.setFieldValue(['answer', 'subjective', 'files'], updatedFiles);
    const answer = form.getFieldValue(['answer']);
    updateAnswer({
          testId: props.testId + '',
          questionId: props.questionId + '',
          answer: answer,
        }, {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: 'File deleted successfully'
            })
          }
        });
      },
      okText: 'Delete'
    })
  }
  const { currentQuestion } = useReviewQuestion();
  const { isMobile } = useBreakpoint();
  
  const imageIssues = currentQuestion?.feedback?.imageIssues;
  const {
    mutate: uploadFiles,
    isLoading: uploadingFile
  } = Common.Queries.useUploadFiles();
  const {openModal }=useModal()
  const UploadButton=  isMobile? <Button type='primary' onClick={() => {
    openModal(<AppCamera onClickPhoto={(file:any) => {
      uploadFiles({
        // @ts-ignore
        files: [{ file: file }],
onSuccess: (files) => {
  // debugger;
          // closeModal && closeModal();
          handleUpload(files.map((f) => {
            return { file: f._id, url: f.url }
                         }));
}
      })
    }} />)
  }}>Click Photo</Button> : <MediaUpload aspect={210/297} multiple
  uploadType="image" cropper={{aspect:16/9}} renderItem={()=><Button icon={<UploadOutlined />}>Upload</Button>}
  onUpload={(files:Types.FileType[]) => {
    console.log(files, 'uploaded')
    handleUpload(files.map((f) => {
      return { name: f.name, file: f._id, url: f.url }
    }));
  }}
/>
  return (
    <Spin spinning={updatingAnswer} >
      <Card
       title="Answer Images" extra={[ !props.review?UploadButton:null]}
      >
      {(imageIssues&&(imageIssues?.length))?  <Alert icon={<WarningOutlined />}
          showIcon style={{ marginBottom: 15 }}
          type='error' message={<Text strong>Issue with images uploaded</Text>}
          description={<Row>
                  <Col span={24}>
                  {(imageIssues)?.map((issue,index) => {
                    return <Text> <b>Image {index+1 }:</b> {issue.issue}</Text>
                })}
                  </Col>
                </Row>} />:null}
        {!files.length?<Empty  description={
          <Row gutter={[10,20]}>
            <Col span={24}>
            <Text>
        Upload your handwritten answer images here
      </Text>
            </Col>
            <Col span={24}>
              {UploadButton}
            </Col>
   </Row>
    }  />:null}
       <Form.List name={['answer', 'subjective', 'files']}>
              {(fields, { add, remove, move }) => {
                  return  (
                    <>
                      <DndProvider backend={HTML5Backend}>
                        <Row gutter={[20, 20]}>
                          <Image.PreviewGroup  >
                     {fields.map((field, index) => {
                         const d = form.getFieldsValue();
                           // console.log(D,'POP')
              const fileDetails = d.answer.subjective.files[field.name]
                       return <Col xs={24} sm={12} md={6} >
                   <DraggableFileItem review={props.review}
                   key={field.key}
                   index={index}
                           id={field.key}
                           fileUrl={fileDetails.url}
                  // @ts-ignore
name={fileDetails.name} // Assuming this is how you access the file name
                   fileId={fileDetails.file} // Assuming this is how you access the file id
                   moveItem={handleMoveItem}
                   removeItem={() => deleteFile(fileDetails.file)}
                                                 />
</Col>
                     })}
                            </Image.PreviewGroup>
         </Row>
                      </DndProvider>
                    </>
                  )
        }}
    </Form.List>
    
     </Card>
     </Spin>
  );
};

    // @ts-ignore
    const DraggableFileItem = ({ id,fileUrl ,fileId,index,review, moveItem, removeItem /* ...other props */ }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: 'file',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
         // @ts-ignore
 const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Move the content
      moveItem(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance to avoid expensive index searches.
         // @ts-ignore
 item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'file',
    item: { type: 'file', id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // Render your file item here, including the remove button and any additional handlers or displays
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card hoverable style={{padding: 0}} bodyStyle={{padding:'10px 0'}}>
      <Row>
        <Col span={24} style={{display:'flex',justifyContent:'center'}}>
        <TestPlayerFileItem fileUrl={fileUrl} fileId={fileId} />
        </Col>
        <Col style={{display:'flex',justifyContent:'center'}} span={24}>
      {!review?  <Button htmlType='button' style={{marginTop:10}}
        danger
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={removeItem}
        />:null}
        </Col>
</Row>
     </Card>
    </div>
  );
};

export default TestPlayerFiles;


const TestPlayerFileItem: React.FC<{ fileId: string,fileUrl:string }> = ({ fileId,fileUrl }) => {
  const { currentQuestion } = useReviewQuestion();
  const imageIssues = currentQuestion?.feedback?.imageIssues;
  const visuals = currentQuestion?.feedback?.visuals;
  // console.log(imageIssues, 'imageIssues');
  const issue = imageIssues?.find(i => i.id === fileId);

    // const { data: url, isLoading } = Common.Queries.useGetPresignedUrlFromFile(
    //   fileId
    // )
  
    // if (isLoading) return <p>Loading...</p>

  return (
      // @ts-ignore
      <AppImage preview visuals={visuals}
caption={(issue) ? <Tooltip title={issue.issue} >
          <Alert showIcon
          type='error'
          icon={<WarningOutlined />}
          style={{ width: 120, padding: 2, paddingLeft: 8,margin:'auto',marginTop: 10 }}
            message='Image Issue' />
        </Tooltip> : null}
        height={120}
        style={{ objectFit: 'cover' }}
      src={fileUrl || 'fallback-image-url'}
      // @ts-ignore
        onClick={e => e.preventDefault()}
      />
    )
  }