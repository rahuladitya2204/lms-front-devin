import { Alert, Button, Card, Col, Empty, Form, FormInstance, Image, Modal, Row, Space, Spin, Tooltip, message } from 'antd'
import { Common, Learner, Types } from '@adewaskar/lms-common'
import { DeleteOutlined, EditFilled, EditOutlined, EditTwoTone, UploadOutlined, WarningOutlined } from '@ant-design/icons'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
// AnswerSheetFiles.tsx
import React, { Fragment, useCallback, useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import AppImage from '@Components/Image'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MediaUpload from '@Components/MediaUpload'
import { MovableItem } from '@Components/DragAndDrop/MovableItem'
import { Typography } from '@Components/Typography'
import update from 'immutability-helper'
import useMessage from '@Hooks/useMessage'
import { useReviewQuestion } from '../../../TestReview/TestPlayerItemReview'

const {Text}=Typography;

const { confirm } = Modal;
const AnswerSheetFiles = (props: { testId: string, review?: boolean }) => {
  const { mutate: updateAnswerSheet,isLoading: updatingAnswer } = Learner.Queries.useUpdateAnswerSheets(props.testId);
  const message = useMessage();
  const [answerSheets, setAnswerSheets] = useState<{file:string,url:string}[]>([]);
  console.log(answerSheets,'answerSheets')

  const { data: {
    status: {
      answerSheets: sheets
    }
  } } = Learner.Queries.useGetTestStatus(props.testId);
  
  useEffect(() => {
    setAnswerSheets(sheets)
   }, [sheets])
    // @ts-ignore
  const handleUpload = (file) => {
    const FILES = [...answerSheets, ...file];
    // add(file)
    setAnswerSheets(FILES);
    updateAnswerSheetApi()
  }
  const updateAnswerSheetApi = (isRearrange?:boolean) => {
    updateAnswerSheet({
      files: answerSheets
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
   setAnswerSheets(update(answerSheets, {
    $splice: [
      [dragIndex, 1],
      [hoverIndex, 0, answerSheets[dragIndex]],
    ],
  }))
    updateAnswerSheetApi(true)
  };

  const deleteFile = (fileId:string) => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this file`,
      onOk() {
        const updatedFiles = answerSheets.filter((f:any) => f.file !== fileId);
        setAnswerSheets(updatedFiles)
    updateAnswerSheet({
          files:answerSheets
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
  const UploadButton=<MediaUpload aspect={210/297} multiple
  uploadType="image" cropper renderItem={()=><Button icon={<UploadOutlined />}>Upload</Button>}
  onUpload={(files:Types.FileType[]) => {
    console.log(files, 'uploaded')
    handleUpload(files.map((f) => {
      return { file: f._id, url: f.url }
    }));
  }}
/>
  return (
    <Spin spinning={updatingAnswer} >
      <Card
       title="Answer Sheet Images" extra={[ !props.review?UploadButton:null]}
      >
        {!answerSheets.length?<Empty  description={
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
           <Image.PreviewGroup  >
   {answerSheets.map((answerSheet,index) => {
      return  <>
      <DndProvider backend={HTML5Backend}>
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} md={6} >
   <DraggableFileItem review={props.review}
   key={answerSheet.file}
   index={index}
   id={answerSheet.file}
  // @ts-ignore
// name={fileDetails.name} // Assuming this is how you access the file name
   fileId={answerSheet.file} // Assuming this is how you access the file id
   moveItem={handleMoveItem}
   removeItem={() => deleteFile(answerSheet.file)}
                                 />
</Col>
</Row>
      </DndProvider>
    </>
    })}
    </Image.PreviewGroup>

     </Card>
     </Spin>
  );
};

    // @ts-ignore
    const DraggableFileItem = ({ id, fileId,index,review, moveItem, removeItem /* ...other props */ }) => {
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
      <Card hoverable style={{padding: 0,marginTop:25}} bodyStyle={{padding:'10px 0'}}>
      <Row>
        <Col span={24} style={{display:'flex',justifyContent:'center'}}>
        <AnswerSheetFileItem fileId={fileId} />
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

export default AnswerSheetFiles;


const AnswerSheetFileItem: React.FC<{ fileId: string }> = ({ fileId }) => {
  const { currentQuestion } = useReviewQuestion();
  const imageIssues = currentQuestion?.feedback?.imageIssues;
  const visuals = currentQuestion?.feedback?.visuals;
  // console.log(imageIssues, 'imageIssues');
  const issue = imageIssues?.find(i => i.id === fileId);

    const { data: url, isLoading } = Common.Queries.useGetPresignedUrlFromFile(
      fileId
    )
  
    if (isLoading) return <p>Loading...</p>
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
      src={url || 'fallback-image-url'}
      // @ts-ignore
        onClick={e => e.preventDefault()}
      />
    )
  }