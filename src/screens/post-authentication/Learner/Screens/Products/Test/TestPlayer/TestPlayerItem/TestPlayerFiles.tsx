import { Button, Card, Col, Form, FormInstance, Image, Row, Space, message } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
// TestPlayerFiles.tsx
import React, { useCallback } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MediaUpload from '@Components/MediaUpload'
import { MovableItem } from '@Components/DragAndDrop/MovableItem'
import update from 'immutability-helper'

const TestPlayerFiles: React.FC = (props:any) => {
  const form = Form.useFormInstance();
  const files = Form.useWatch(['answer', 'subjective', 'files'], form);
    // @ts-ignore
  const handleUpload = (file) => {
    // add(file)
    message.success('File uploaded successfully');
    form.setFieldValue(['answer', 'subjective', 'files'], [...files, file]);
  }
  console.log(files, 'files');
  return (
       <Card
       title="Answer Files" extra={[   <ActionModal
        cta={<Button icon={<UploadOutlined />}>Upload</Button>}
      >

        <MediaUpload
          uploadType="file"
          onUpload={({ name, _id }) => {
            // console.log(answer, 'existing')
            handleUpload({ name, file: _id })
          }}
        />
      </ActionModal>]}
    >
       <Form.List name={['answer', 'subjective', 'files']}>
              {(fields, { add, remove, move }) => {
                  console.log(fields,'fields')
                  return  (
                    <>
                      <DndProvider backend={HTML5Backend}>
         <Row gutter={[20,20]}>
                     {fields.map((field, index) => {
                         const d = form.getFieldsValue();
                           // console.log(D,'POP')
              const fileDetails = d.answer.subjective.files[field.name]
                       return <Col>
                  
                   <DraggableFileItem
                   key={field.key}
                   index={index}
                   id={field.key}
                  // @ts-ignore
name={fileDetails.name} // Assuming this is how you access the file name
                   fileId={fileDetails.file} // Assuming this is how you access the file id
                   moveItem={move}
                   removeItem={() => remove(index)}
                                                 />
</Col>
           })}
         </Row>
                      </DndProvider>
                    </>
                  )
        }}
    </Form.List>
    
     </Card>
  );
};

    // @ts-ignore
    const DraggableFileItem = ({ id, fileId,index, moveItem, removeItem /* ...other props */ }) => {
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
        <TestPlayerFileItem fileId={fileId} />
        </Col>
        <Col style={{display:'flex',justifyContent:'center'}} span={24}>
        <Button htmlType='button' style={{marginTop:10}}
        danger
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={removeItem}
        />
        </Col>
</Row>
     </Card>
    </div>
  );
};

export default TestPlayerFiles;


const TestPlayerFileItem: React.FC<{ fileId: string }> = ({ fileId }) => {
    console.log(fileId, 'filedIII')
    const { data: url, isLoading } = Common.Queries.useGetPresignedUrlFromFile(
      fileId
    )
  
    if (isLoading) return <p>Loading...</p>
  
    return (
      <Image
        width={100}
        height={100}
        style={{ objectFit: 'cover' }}
        src={url || 'fallback-image-url'}
        onClick={e => e.preventDefault()}
      />
    )
  }