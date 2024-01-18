import { Alert, Button, Card, Col, Divider, Empty, Form, FormInstance, Image, Input, Modal, Row, Space, Spin, Tooltip, message } from 'antd'
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditFilled, EditOutlined, EditTwoTone, InfoOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons'
import { Common, Learner, Store, Types, User } from '@adewaskar/lms-common'
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
import { openWindow } from '@Components/SunEditor/utils'
import update from 'immutability-helper'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useParams } from 'react-router'
import { useReviewQuestion } from '../../../TestReview/TestPlayerItemReview'

const { Text } = Typography;

interface AnswerSheetFilesPropsI {
  testId?: string, review?: boolean, closeModal?: Function; type?: string; learnerId?: string;
}

const { confirm } = Modal;
const AnswerSheetFiles = (props: AnswerSheetFilesPropsI) => {
  const params = useParams();
  const testId = (params.testId || props.testId) + '';
  const learnerId = (params.learnerId || props.learnerId) + '';
  const NAMESPACE = (props.type === 'user' || learnerId) ? User : Learner;
  // @ts-ignore
  const { mutate: updateAnswerSheet,isLoading: updatingAnswer } = NAMESPACE.Queries.useUpdateAnswerSheets(testId,learnerId);
  // @ts-ignore
  const { mutate: verifyAnswerSheet,isLoading: verifyingAnswerSheet } = NAMESPACE.Queries.useVerifyAnswerSheet(testId,learnerId);
  // @ts-ignore
  const { mutate: applyAnswerSheets,isLoading: applyingAnswerSheets } = NAMESPACE.Queries.useEvaluateAnswerSheets(testId,learnerId);
  const [form] = Form.useForm<Types.AnswerSheet>();
  const message = useMessage();
  const files = Form.useWatch(['files'], form) || [];
  const filledCount = Form.useWatch(['metrics', 'filled'], form);
  // console.log(files,'files')
  console.log(learnerId,props.type,'learnerId')
  const { data: {
    status: {
      answerSheets
    }
      // @ts-ignore
  }, isFetching: loadingTestStatus } = NAMESPACE.Queries.useGetTestStatus(testId,learnerId);
  useEffect(() => {
    if (answerSheets.files) {
      console.log(answerSheets.files, 'updated');
      form.setFieldsValue(answerSheets);
    }
  }, [answerSheets])
  
  // useEffect(() => {
  //   updateAnswerSheetApi();
  //  },[files])
    // @ts-ignore
  const handleUpload = (file) => {
    const d = form.getFieldsValue();
    d.files = [...files, ...file];
    // add(file)
    // form.setFieldValue(['files'], FILES);
    updateAnswerSheetApi(d)
  }
  const updateAnswerSheetApi = (d:Types.AnswerSheet) => {
    console.log(d, 'dddd');
    updateAnswerSheet({ data: d}, {
      onSuccess: () => {
        message.open({
          type: 'success',
          content: `Answer Sheets Updated`
        })
      }
    });
  }
  const handleMoveItem = (dragIndex: number, hoverIndex: number) => {
    const d = form.getFieldsValue();
    d.files = update(form.getFieldValue(['files']), {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, form.getFieldValue(['files'])[dragIndex]],
      ],
    });
    updateAnswerSheetApi(d)
  };

  const cropItem = (index: number, croppedUrl:string) => {
    const d = form.getFieldsValue();
    d.files[index].url = croppedUrl;
    console.log(d.files, 'files');
    updateAnswerSheetApi(d)
  };

  const deleteFile = (fileId:string) => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this file`,
      onOk() {
        const d = form.getFieldsValue();
        d.files = d.files.filter((f:any) => f.file !== fileId);
        updateAnswerSheetApi(d);
      },
      okText: 'Delete'
    })
  }
  const { openModal } = useModal();
  const {
    mutate: uploadFiles,
    isLoading: uploadingFile
  } = Common.Queries.useUploadFiles();
  const user = Store.useAuthentication(s => s.user);
  const VerifyAnswerSheet = (files: any[]) => {
    const url = files[0].url;
    verifyAnswerSheet({
      url: url,
    }, {
        // @ts-ignore
onSuccess: blobStr => {
        const file = new Blob([blobStr], { type: 'image/png' }); // replace 'application/pdf' with the correct MIME type for your file

        // You can then create a URL for the blob to download it or display it in the browser
        const fileURL = URL.createObjectURL(file);
        console.log(fileURL, 'fileURL');
        openModal(<Spin spinning={uploadingFile}>
          <Row>
            <Col span={24}>
            <Alert icon={<InfoOutlined/>} type='info' message='Please verify the filled bubbles below with your answer sheet' />,
          <Image src={fileURL} />
          </Col>
          </Row>
          
        </Spin>, {
          closable: true,
          title: `Verify Answer Sheet`,
          footer: closeModal => {
            return [<Row justify={'space-between'}>
              <Col>
              <Button icon={<CloseOutlined />}
            onClick={() => closeModal()}
            danger>
              Reject</Button>
              </Col>
              <Col>
                <Row gutter={[20,10]}>
                  <Col>
                  <Button type='primary' icon={<CheckOutlined/>} onClick={() => {
                handleUpload(files.map((f) => {
   return { file: f._id, url: f.url }
                }));
                 closeModal();
                    }}>Accept</Button>
                  </Col>
                </Row>
      
                
              </Col>
            </Row>]
          }
        })
      }
    });
  }
  const UploadButton = <MediaUpload compress={{maxWidth: 1240,maxHeight: 1754,quality:1}} aspect={210 / 297} multiple
    uploadType="image" renderItem={() => <Button icon={<UploadOutlined />}>Upload</Button>}
    onUpload={(files: Types.FileType[]) => {
      console.log(files, 'uploaded')
      VerifyAnswerSheet(files)
 
    }}
  />;

  const save = (d:Types.AnswerSheet) => {
    // console.log(d, 'dd');
    // const d = form.getFieldsValue();
    updateAnswerSheetApi(d);
  }
  const {isMobile } = useBreakpoint();
  return (
    <div style={{paddingLeft:10,paddingRight:10}}>
      <Spin spinning={verifyingAnswerSheet} tip='Analysing Answer Sheet..' > 
         {!props.closeModal? <Button onClick={() => {
            if (window?.opener?.onComplete) {
              window.close()
            }
          }} danger block={isMobile} style={{marginTop:10}} icon={<ArrowLeftOutlined/>} type='primary'>
            Go back to Answer Sheet
          </Button>:null}
      <Card style={{marginTop:20}}
       title="Answer Sheet Images" extra={[ !props.review?(files.length?UploadButton:null):null]}
      >
        <Form layout='vertical' onFinish={save} form={form}>
        {files.length?<Alert style={{marginBottom:15}} message="Following must be equal to the total bubbles you filled in the answer sheet" type="info" showIcon />:null}

          {files.length ? <Row justify={'center'} align={'middle'} gutter={[15,0]}>
            <Col flex={1}>
            <Form.Item required name={['metrics','filled']} label='Total Filled Bubbles'>
          <Input type='number' />
              </Form.Item>
            </Col>
            <Col xs={24} flex={isMobile ? 1 : 'none'} style={{display:'flex',alignItems:'center'}}>
            <Button block={isMobile} loading={updatingAnswer}
           onClick={form.submit}>
            Save Filled Bubbles
          </Button>
          </Col>
        </Row>:null}
        <Spin spinning={uploadingFile || loadingTestStatus || updatingAnswer || uploadingFile}>
  {!files.length?<Empty  style={{marginTop:15}} description={
          <Row gutter={[10,20]}>
            <Col span={24}>
            <Text>
        Upload your Answer Sheet images here
      </Text>
            </Col>
          {!files.length?  <Col span={24}>
              {UploadButton}
            </Col>:null}
   </Row>
    }  />:null}
          <Form.List name={['files']}>
              {(fields, { add, remove, move }) => {
                  return  (
                    <>
                      <DndProvider backend={HTML5Backend}>
                        <Row style={{marginTop:15}} gutter={[20, 20]}>
                          <Image.PreviewGroup  >
                     {fields.map((field, index) => {
                       const d = form.getFieldsValue();
                      //  console.log(d,'d')
                           // console.log(D,'POP')
              const fileDetails = d.files[field.name]
                       return <Col xs={24} sm={12} md={6} >
                   <DraggableFileItem learnerId={learnerId} type={props.type} testId={testId} fileUrl={fileDetails.url} cropItem={cropItem} review={props.review}
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
 </Spin>
       </Form>
      </Card>
      {files.length?<><Divider/>
      <Row gutter={[20, 20]} justify={'center'}>
        <Col flex={isMobile ? 1 : 'none'}>
          <Button type='primary' block={isMobile} loading={applyingAnswerSheets}
          style={{ marginTop: 20 }} onClick={()=>applyAnswerSheets(undefined,{
            onError: (e:any) => {
              message.open({
                type: 'error',
                content: e.response.data.message
              });
              // props.closeModal && props.closeModal();
            },
            onSuccess: () => {
              message.open({
                type: 'success',
                content: `Answer Sheet recorded successfully`
              });
              if (window?.opener?.onComplete) {
                window?.opener?.onComplete(true)
                window.close();
              }
              else {
                props.closeModal && props.closeModal();
              }
            }
          })}
            disabled={!(filledCount&&files.length)}
            >
            Apply Answer Sheet
            </Button>
          </Col>    
         </Row></>:null}
      </Spin>
      
    </div>
  );
};

    // @ts-ignore
    const DraggableFileItem = ({ id,fileUrl,type,testId, learnerId,fileId,index,review,cropItem, moveItem, removeItem /* ...other props */ }) => {
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
      const NAMESPACE = (type === 'user' || learnerId) ? User : Learner;

      const { mutate: verifyAnswerSheet, isLoading: verifyingAnswerSheet } = NAMESPACE.Queries.useVerifyAnswerSheet(testId, learnerId);
      const {openModal } = useModal();
      const VerifyAnswerSheet = (url:string) => {
    verifyAnswerSheet({
      url: url,
    }, {
      onSuccess: blobStr => {
        const file = new Blob([blobStr], { type: 'image/png' }); // replace 'application/pdf' with the correct MIME type for your file

        // You can then create a URL for the blob to download it or display it in the browser
        const fileURL = URL.createObjectURL(file);
        console.log(fileURL, 'fileURL');
        openModal(<Row>
          <Col span={24}>
          <Alert icon={<InfoOutlined/>} type='info' message='Please verify the filled bubbles below with your answer sheet' />,
 <Image src={fileURL} />
          </Col>
        </Row>, {
          title:'Verify Answer Sheet',
          closable: true,
          footer: closeModal => {
            return [    <Button icon={<CloseOutlined />}
            onClick={() => closeModal()}
            danger>
            Close</Button>]
          }
        })
      }
    });
      }
      const { isMobile } = useBreakpoint();
      const {
        mutate: uploadFiles,
        isLoading: uploadingFile
      } = Common.Queries.useUploadFiles();
      const user = Store.useAuthentication(s => s.user);
      const prefixKey = `tests/${testId}/answer-sheets/${user._id}/page-${index+1}`;
      return (
        <Spin spinning={uploadingFile}>
          <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card hoverable style={{padding: 0}} bodyStyle={{padding:'10px 0'}}>
              <Row>
        <Col span={24} style={{display:'flex',justifyContent:'center'}}>
        <AnswerSheetFileItem type={type} fileUrl={fileUrl} fileId={fileId} />
                </Col>
                <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Row style={{paddingLeft:5,paddingRight:5}} gutter={[20,0]}>
                    {/* <Col span={24}>
                    <Button block htmlType='button' style={{marginTop:10}}
        size='small'
                        onClick={() => {
                            openModal( <PerspectiveCropper onCrop={(blob: any,closeModal?:Function) => {
                              closeModal && closeModal();
                              // @ts-ignore
                  uploadFiles({
                  files: [{ file: blobToFile(blob),prefixKey }],
                  onSuccess: ([{url}]) => {
                  cropItem(index, url);
                  }
                  })
                  }} image={fileUrl} />)
                          }
      }
              >Crop</Button>
                    </Col> */}
                    <Col span={24}>
                    <Button block style={{marginTop:10,width:87}} loading={verifyingAnswerSheet} size='small' type='primary' onClick={() => {
                    VerifyAnswerSheet(fileUrl)
                  }} >Verify</Button>
                    </Col>
               </Row>
                
                </Col>
        <Col style={{display:'flex',justifyContent:'center'}} span={24}>
            {!review ? <Space>
              <Button htmlType='button' style={{marginTop:10,width:87}}
        danger
        size='small'
        // shape="circle"
        // icon={<DeleteOutlined />}
        onClick={removeItem}
                  >Delete</Button>           
      </Space>:null}
                </Col>
              
</Row>
     </Card>
    </div>
    </Spin>
  );
};

export default AnswerSheetFiles;


const AnswerSheetFileItem: React.FC<{ fileId: string,fileUrl:string,type?:string }> = ({ fileId,fileUrl,type }) => {
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