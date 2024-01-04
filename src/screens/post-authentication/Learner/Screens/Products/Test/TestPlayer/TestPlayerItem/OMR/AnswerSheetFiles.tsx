import { Alert, Button, Card, Col, Empty, Form, FormInstance, Image, Input, Modal, Row, Space, Spin, Tooltip, message } from 'antd'
import { Common, Learner, Types } from '@adewaskar/lms-common'
import { DeleteOutlined, EditFilled, EditOutlined, EditTwoTone, UploadOutlined, WarningOutlined } from '@ant-design/icons'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
// AnswerSheetFiles.tsx
import React, { Fragment, useCallback, useEffect } from 'react'
import { blobToFile, convertImageToBlob } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'

import ActionModal from '@Components/ActionModal/ActionModal'
import AppImage from '@Components/Image'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MediaUpload from '@Components/MediaUpload'
import { MovableItem } from '@Components/DragAndDrop/MovableItem'
import PerspectiveCropper from '@Components/PerspectiveCropper'
import { Typography } from '@Components/Typography'
import update from 'immutability-helper'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useReviewQuestion } from '../../../TestReview/TestPlayerItemReview'

const {Text}=Typography;

const { confirm } = Modal;
const AnswerSheetFiles = (props: { testId: string, review?: boolean,closeModal?:Function }) => {
  const { mutate: updateAnswerSheet,isLoading: updatingAnswer } = Learner.Queries.useUpdateAnswerSheets(props.testId);
  const { mutate: applyAnswerSheets,isLoading: applyingAnswerSheets } = Learner.Queries.useEvaluateAnswerSheets(props.testId);
  const [form] = Form.useForm<Types.AnswerSheet>();
  const message = useMessage();
  const files = Form.useWatch(['files'], form) || [];
  console.log(files,'files')

  const { data: {
    status: {
      answerSheets
    }
  } }=Learner.Queries.useGetTestStatus(props.testId)
  useEffect(() => {
    if(answerSheets.files){
      form.setFieldsValue(answerSheets);
    }
   }, [answerSheets])
    // @ts-ignore
  const handleUpload = (file) => {
    const FILES = [...files, ...file];
    // add(file)
    form.setFieldValue(['files'], FILES);
    // updateAnswerSheetApi()
  }
  const updateAnswerSheetApi = () => {
    const d = form.getFieldsValue();
    updateAnswerSheet(d, {
      onSuccess: () => {
        message.open({
          type: 'success',
          content: `Answer Sheets Updated`
        })
      }
    });
  }
  const handleMoveItem = (dragIndex:number, hoverIndex: number) => {
    // Update the order of files in the form
    form.setFieldValue(['files'], update(form.getFieldValue(['files']), {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, form.getFieldValue(['files'])[dragIndex]],
      ],
    }));
    // updateAnswerSheetApi(true)
  };

  const cropItem = (index: number, croppedUrl:string) => {
    const FILES = form.getFieldValue(['files']);
    FILES[index].url = croppedUrl;
    console.log(FILES, 'files');
    // Update the order of files in the form
    form.setFieldValue(['files'], FILES);
    // updateAnswerSheetApi(true)
  };

  const deleteFile = (fileId:string) => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this file`,
      onOk() {
        const d = form.getFieldsValue();
        const updatedFiles = d.files.filter((f:any) => f.file !== fileId);
        form.setFieldValue(['files'], updatedFiles);
    // updateAnswerSheet(d, {
    //       onSuccess: () => {
    //         message.open({
    //           type: 'success',
    //           content: 'File deleted successfully'
    //         })
    //       }
    //     });
      },
      okText: 'Delete'
    })
  }
  const UploadButton = <MediaUpload aspect={210 / 297} multiple
    uploadType="image" cropper renderItem={() => <Button icon={<UploadOutlined />}>Upload</Button>}
    onUpload={(files: Types.FileType[]) => {
      console.log(files, 'uploaded')
      handleUpload(files.map((f) => {
        return { file: f._id, url: f.url }
      }));
    }}
  />;

  const save = (d:Types.AnswerSheet) => {
    console.log(d, 'dd');
    updateAnswerSheetApi();
  }
  const {isMobile } = useBreakpoint();
  return (
    <Fragment>
      <Card style={{marginTop:20}}
       title="Answer Sheet Images" extra={[ !props.review?UploadButton:null]}
      >
        <Form layout='vertical' onFinish={save} form={form}>
        <Form.Item name={['metrics','filled']} label='Total Filled Bubbles'>
          <Input style={{width:150}} type='number' />
        </Form.Item>
        {!files.length?<Empty  description={
          <Row gutter={[10,20]}>
            <Col span={24}>
            <Text>
        Upload your Answer Sheet images here
      </Text>
            </Col>
            <Col span={24}>
              {UploadButton}
            </Col>
   </Row>
    }  />:null}
       <Form.List name={['files']}>
              {(fields, { add, remove, move }) => {
                  return  (
                    <>
                      <DndProvider backend={HTML5Backend}>
                        <Row gutter={[20, 20]}>
                          <Image.PreviewGroup  >
                     {fields.map((field, index) => {
                       const d = form.getFieldsValue();
                      //  console.log(d,'d')
                           // console.log(D,'POP')
              const fileDetails = d.files[field.name]
                       return <Col xs={24} sm={12} md={6} >
                   <DraggableFileItem testId={props.testId} fileUrl={fileDetails.url} cropItem={cropItem} review={props.review}
                   key={field.key}
                   index={index}
                   id={field.key}
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
       </Form>
    
      </Card>
      <Row gutter={[20, 20]} justify={'center'}>
      <Col flex={isMobile ? 1 : 'none'}> <Button block={isMobile} loading={applyingAnswerSheets}
          style={{ marginTop: 20 }} onClick={()=>applyAnswerSheets(undefined,{
            onError: (e:any) => {
              message.open({
                type: 'error',
                content: e.response.data.message
              });
              props.closeModal && props.closeModal();
            }
          })}>
            Apply Answer Sheet
          </Button></Col>
        <Col flex={isMobile ? 1 : 'none'}> <Button block={isMobile} loading={updatingAnswer}
          style={{ marginTop: 20,width:100 }} onClick={form.submit} type='primary'>
            Save
        </Button></Col>
        
    
         </Row>
     </Fragment>
  );
};

    // @ts-ignore
    const DraggableFileItem = ({ id,fileUrl,testId, fileId,index,review,cropItem, moveItem, removeItem /* ...other props */ }) => {
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
      const {
        mutate: uploadFiles,
        isLoading: uploadingFile
      } = Common.Queries.useUploadFiles();
      const {data:learner } = Learner.Queries.useGetLearnerDetails();
      const prefixKey = `tests/${testId}/answer-sheets/${learner._id}`;
      return (
        <Spin spinning={uploadingFile}>
          <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card hoverable style={{padding: 0}} bodyStyle={{padding:'10px 0'}}>
      <Row>
        <Col span={24} style={{display:'flex',justifyContent:'center'}}>
        <AnswerSheetFileItem fileUrl={fileUrl} fileId={fileId} />
        </Col>
        <Col style={{display:'flex',justifyContent:'center'}} span={24}>
            {!review ? <Space>
              <Button htmlType='button' style={{marginTop:10}}
        danger
        size='small'
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={removeItem}
                  />
                  <ActionModal cta={<Button htmlType='button' style={{marginTop:10}}
        // danger
        size='small'
        shape="circle"
        icon={<EditOutlined />}
              /> }>
                  <PerspectiveCropper onCrop={(blob: any,closeModal?:Function) => {
                                           closeModal && closeModal();
                                           // @ts-ignore
                    uploadFiles({
                      files: [{ file: blobToFile(blob),prefixKey }],
                      onSuccess: ([{url}]) => {
                        cropItem(index, url);
                      }
                    })
                  }} image={fileUrl} />
                  </ActionModal>
               
      </Space>:null}
        </Col>
</Row>
     </Card>
    </div>
    </Spin>
  );
};

export default AnswerSheetFiles;


const AnswerSheetFileItem: React.FC<{ fileId: string,fileUrl:string }> = ({ fileId,fileUrl }) => {
  const { currentQuestion } = useReviewQuestion();
  const imageIssues = currentQuestion?.feedback?.imageIssues;
  const visuals = currentQuestion?.feedback?.visuals;
  // console.log(imageIssues, 'imageIssues');
  const issue = imageIssues?.find(i => i.id === fileId);
  
    // if (isLoading) return <p>Loading...</p>
      // console.log(issue,'issue')
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