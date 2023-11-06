import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Switch,
  Typography,
} from 'antd'
import { Constants, Enum, Types, User } from '@adewaskar/lms-common'
import { DeleteTwoTone, PlusCircleTwoTone, UploadOutlined } from '@ant-design/icons';
import { useOutletContext, useParams } from 'react-router';

import ActionModal from '@Components/ActionModal';
import ErrorBoundary from '@Components/ErrorBoundary';
import GenerateQuestionWithAI from '@User/Screens/ExtraComponents/TestQuestions/GenerateQuestionWithAI';
import InputTags from '@Components/InputTags/InputTags';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import TextArea from '@Components/Textarea';
import UploadVideo from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoPopup/UploadVideo';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import useUpdateTestForm from './hooks/useUpdateTest';

const { Title } = Typography;

const { confirm } = Modal;

export const QUESTION_TYPES=[
  { value: 'single', label: 'Single Choice' },
  { value: 'multiple', label: 'Multiple Choice' },
  { value: 'subjective', label: 'Subjective' },
];
interface CreateQuestionFormPropsI {
  submit?: (d: Types.TestQuestion) => void;
  data?: Types.TestQuestion;
  closeModal?: Function;
  onFormChange?: (d: Partial<Types.TestQuestion>) => void;
}


const AddQuestion: React.FC<CreateQuestionFormPropsI> = props => {
  const [form] = Form.useForm();
  const [enterHtml, setEnterHtml] = useState(false);
  const { handleTopicsChange,topics,onFormChange,updateItem} = useUpdateTestForm( form);
  const {  itemId,id: testId } = useParams();
  
  const {data: test }=User.Queries.useGetTestDetails(testId+'')
  
  const isTestEnded = test.status === Enum.TestStatus.ENDED;;

    const submit = (e: Types.TestQuestion) => {
      props.submit && props.submit({ ...e });
      form.resetFields();
      props.closeModal && props.closeModal();
    }
  
  const questionType = Form.useWatch('type', form);
  
  const OptionSelectedFormControl = questionType === 'single' ? Radio : Checkbox;

  const {data: item } = User.Queries.useGetTestItemDetails(testId+'', itemId+'');
  
  const { data: file } = User.Queries.useGetFileDetails(item?.solution?.video + '', {
    enabled: !!item?.solution?.video
  });

  const jobId = file?.metadata?.video?.jobId;
  const {
    data: { status, progress }
  } = User.Queries.useGetTranscodeVideoStatus(jobId, {
    retry: true,
    enabled:!!jobId,
    retryDelay: 4000
  })
  const fileId = file.encoded || file._id;
  const {  mutate: generateItemInfoApi, isLoading: generatingSummary ,data: generatedInfo} = User.Queries.useGetGenerativeTestItemInfo();
  const generateItemInfo = (fields: string[]) => {
    generateItemInfoApi({ data: { testId:testId+'', itemId:itemId+'' ,fields} }, {
      onSuccess: ({  topics }) => {
        if (topics&&topics.length) {
          handleTopicsChange(topics)
        }
        // console.log(topics,'123123')
        // form.setFieldValue('summary', summary);
      }
    });
  }
  const options = Form.useWatch('options', form) || [];

  const EnterHtmlButton = <Switch checked={enterHtml} onChange={setEnterHtml} />;
  // console.log(options,'setCorrectOptions')
  return (
   <ErrorBoundary> <Form name='test' onFinish={submit} initialValues={item}
   onValuesChange={(changedValues, allValues) => onFormChange(allValues)} 
form={form}
layout="vertical"
>
 <Row gutter={[10,30]}>
   <Col span={24}>
  {!isTestEnded? <Alert
           message="Generate question with AI"
           description="You can generate question outline using our AI"
           type="info"
           showIcon
           action={
             <ActionModal cta={<Button type='primary'>Generate with AI</Button>}>
               <GenerateQuestionWithAI submit={d => {
                 // console.log(d, 'ddd12121212');
                 if (d.topics) {
                   // @ts-ignore
                   d.topics = d?.topics?.map(topic => {
                     return {
                       title: topic,
                       topicId: uniqueId()
                     }
                   })
                 }
               // setCorrectOptions(d.correctOptions)
                 d.isAiGenerated = true;
                 updateItem(d);

       }}/>
           </ActionModal>
           }
         />:null}

</Col>
   <Col span={24}>
 
     <Card bordered={false} extra={[EnterHtmlButton]}>
   
     <Form.Item name="title" label="Title" required   rules={[
         {
           required: true,
           message: "Enter questions's title"
         }
         ]}>
           {/* @ts-ignore */}
       <TextArea html={enterHtml?false:{level:3}} readonly={isTestEnded} readOnly={item?.isAiGenerated} height={250} placeholder="Enter the question title" />
     </Form.Item>
     <Row gutter={[20, 20]}>
       <Col span={12}>
       <Form.Item label='Question Type' name={'type'}>
     <Select  disabled={isTestEnded}
   style={{ width: '100%' }}
   options={QUESTION_TYPES}
 />

     </Form.Item>
       </Col>
       <Col span={12}>
       <Form.Item name="score" label="Question Score" required  rules={[
         {
           required: true,
           message: "Enter the score for this question"
         }
       ]}>
       <Input  readOnly={isTestEnded} placeholder="Enter the score for this question" />
     </Form.Item>
           </Col>
           <Col span={24}>
           <Form.Item
       // name="topics"
               label={<span>Topics
                {!isTestEnded? <Button loading={( generatingSummary)} onClick={() => generateItemInfo(['topics'])} type='primary' size='small'>Generate</Button>:null}
               </span>}
       rules={[{ required: true, message: "Please input your topics!" }]}
     >
       <InputTags options={topics.map(i=>(i.title))} name="topics" onChange={handleTopicsChange} ctaText={!isTestEnded?`Enter Topics`:''} /> 
     </Form.Item>
           </Col>
    </Row>
     <Row gutter={[20, 20]}>
       <Col span={24}>
             <Card style={{ marginBottom: 20 }} extra={[EnterHtmlButton]} title="Answers">
               {/* <OptionSelectedFormControl.Group> */}

         <Form.List name="options">
     {(fields, { add, remove }) => (
       <>
                     {fields.map(({ key, name, ...restField }, index) => {
                       const currentOption = options[index] || Constants.INITIAL_TEST_QUESTION_OPTION;
                       // console.log(currentOption,'currentOption')
           return (
             <Row justify={'center'}>
                 <Col flex={1}>
                     <Form.Item 
                         rules={[
                             { required: true, message: 'Please enter the answer.' },
                         ]}
                         {...restField}
                         name={[name, 'text']}
                       >
                         <TextArea height={150} html={enterHtml?false:{level:3}} readOnly={isTestEnded} placeholder={`Answer ${index + 1}`}/> 
                     </Form.Item>
                 </Col>
                         <Col>
                         <Form.Item  {...restField}
                           name={[name, 'isCorrect']}
                           valuePropName="checked">
                 <OptionSelectedFormControl
                   checked={!!currentOption?.isCorrect} value={false}
                         // value={index} // Assigning value to OptionSelectedFormControl
                         // checked={!!currentOption.isCorrect} // Calculating checked status
                         disabled={!!item.isAiGenerated}
                     onClick={e => {
                       const opts = [...options];
                       // @ts-ignore
                             if (e.target.checked) {
                               if (questionType === 'single') {
                                 opts.forEach(o => {
                                   o.isCorrect = false;
                                 })
                               }
                               opts[index].isCorrect = true;
                             }
                             else {
                               opts[index].isCorrect = false;
                             }

                       form.setFieldsValue({
                         options: opts
                       });
                       // onFormChange
                             // setCorrectOptions(options);
                         }}
                         style={{ marginLeft: 20 }}
                   />
                   </Form.Item>
                 
                     <DeleteTwoTone onClick={e => {
                         confirm({
                             title: 'Are you sure?',
                             content: `You want to delete this answer`,
                             onOk() {
                                 remove(index);
                             },
                             okText: 'Delete Answer'
                         });
                     }} style={{ marginLeft: 10 ,fontSize: 15 }} />
                 </Col>
             </Row>
         )
         })}

                 <Button onClick={e=>add()} icon={<PlusCircleTwoTone/>}>Add Option</Button>
       </>
     )}
               </Form.List>
               {/* </OptionSelectedFormControl.Group> */}

             </Card>
       </Col>
           </Row>
    </Card>
   </Col>
   <Col span={24}>
       
   <Card title='Solution Text'>
   <Form.Item name={['solution', 'html']} required>
   <TextArea
     height={350} html={{level: 3}}
     value={form.getFieldValue(['solution', 'html'])}
     onChange={(e: string) => form.setFieldsValue({ solution: { html: e } })}
   />
 </Form.Item>
             </Card>
   </Col>
   <Col span={24}>
   <Card style={{marginTop:20}} title='Solution Video' extra={[  <ActionModal cta={<Button icon={<UploadOutlined />}>{(file._id) ? 'Replace video' : 'Upload Solution Video'}</Button>}>
     <UploadVideo prefixKey={`test/${testId}/${
                 itemId
               }/solution/video/index`} item={item}
       onUpload={(item) => {
         // console.log(item, 'item')
         // @ts-ignore
         updateItem({
           solution: {
             video: item.file+''
           }
         })
         }
       
             }
              />
           </ActionModal>]}>
       {status === 'PROGRESSING' ? (
         <>
           <Title level={3} style={{marginTop:0}}> Processing Video...</Title>
           <Progress style={{marginBottom:20}} percent={progress} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
         </>
       ) : null}
           {file._id ? <MediaPlayer fileId={fileId} /> :<Empty description='No Video Uploaded'  />}
         </Card>
     </Col>

 </Row>
 </Form></ErrorBoundary>
  )
}

export default AddQuestion
