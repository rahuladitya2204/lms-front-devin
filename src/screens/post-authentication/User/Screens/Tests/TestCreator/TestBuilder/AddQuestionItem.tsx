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
  Spin,
  Switch,
  Tag,
} from 'antd'
import { Constants, Enum, Types, User } from '@adewaskar/lms-common'
import { DeleteTwoTone, PlusCircleTwoTone, UploadOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ActionModal from '@Components/ActionModal/ActionModal';
import AppImage from '@Components/Image';
import EnterLatexText from './EnterLatexText';
import GenerateAIItemDetails from './GenerateAIItemDetails';
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer';
import MediaUpload from '@Components/MediaUpload';
import Tabs from '@Components/Tabs';
import TextArea from '@Components/Textarea';
import { Typography } from '@Components/Typography';
import UploadVideo from '@User/Screens/Courses/CourseEditor/CourseBuilder/UploadItems/UploadVideo/UploadVideoPopup/UploadVideo';
import { useParams } from 'react-router';
import useTestBuilderUI from './hooks/useTestBuilder';
import useTestNavigation from '@User/Screens/Event/LiveSessionPlayer/User/useProductNavigation';
import { useTestStore } from './hooks/useTestStore';
import useUpdateTestForm from './hooks/useUpdateTest';

const { Title } = Typography;

const { confirm } = Modal;

export const QUESTION_TYPES=[
  { value: Enum.TestQuestionType.SINGLE, label: 'Single Choice' },
  { value: Enum.TestQuestionType.MULTIPLE, label: 'Multiple Choice' },
  { value: Enum.TestQuestionType.NUMERIC, label: 'Numeric' },
  { value: Enum.TestQuestionType.SUBJECTIVE, label: 'Subjective' },
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
  const {  itemId,id: testId } = useParams();
  const { handleTopicsChange,topics,onFormChange,updateItem} = useUpdateTestForm(itemId+'');
  const item = useTestStore(s => s.currentQuestion);
  const { data: test } = User.Queries.useGetTestDetails(testId + '');
  const criterias = Form.useWatch('criterias', form);
 
  const isTestEnded = test.status === Enum.TestStatus.ENDED;
  const { navigate } = useTestNavigation(test);

  useEffect(() => {
    form.setFieldsValue(item);
   },[item])

    const submit = (e: Types.TestQuestion) => {
      props.submit && props.submit({ ...e });
      form.resetFields();
      props.closeModal && props.closeModal();
    }
  
  const questionType = Form.useWatch('type', form);
  // const { updateNavigator } = useTestBuilderUI();
  const OptionSelectedFormControl = questionType === Enum.TestQuestionType.SINGLE ? Radio : Checkbox;  
  const { data: file } = User.Queries.useGetFileDetails(item?.solution?.video + '', {
    enabled: !!item?.solution?.video
  });

  const jobId = file?.metadata?.video?.jobId;
  const {
    data: { status, progress }
  } = User.Queries.useGetTranscodeVideoStatus(jobId, {
    retry: true,
    enabled: !!jobId,
    retryDelay: 4000
  });
  const {
    mutate: deleteSectionItemApi,
    isLoading: deletingSectionItem
  } = User.Queries.useDeleteTestSectionItem()
  const DeleteSectionItem = ( ) => {
    confirm({
      title: 'Are you sure?',
      content: `You want to delete this section item`,
      onOk() {
        deleteSectionItemApi({
          data: { testId: testId + '', itemId: itemId+'' }
        })
      },
      okText: 'Delete'
    })
  }
  const fileId = file.encoded || file._id;
  const options = Form.useWatch('options', form) || [];


  useEffect(() => {
    onFormChange({ criterias });
  }, [criterias])
  const prefixKey = `tests/${testId}/${itemId}`;
  const getFormComponent = (language: string) => <Form name='test' onFinish={submit} initialValues={item}
  onValuesChange={(changedValues, allValues) => onFormChange({
    ...allValues,
    ...(criterias || {})
  })}
  form={form}
  layout="vertical"
>
  <Row gutter={[10, 30]}>
    <Col span={24}>
    </Col>
    <Col span={24}>

      <Card bordered={false}>

        <Form.Item name={['title', 'text', language]} label="Title" required rules={[
          {
            required: true,
            message: "Enter questions's title"
          }
        ]}>
          {/* @ts-ignore */}
          <TextArea uploadPrefixKey={prefixKey} html={enterHtml ? false : { level: 3 }} readonly={isTestEnded} readOnly={item?.isAiGenerated} height={250} placeholder="Enter the question title" />
        </Form.Item>
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <Form.Item label='Question Type' name={'type'}>
              <Select disabled={isTestEnded}
                style={{ width: '100%' }}
                options={QUESTION_TYPES}
              />

            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={['score', 'correct']} label="Correct Answer Score" required rules={[
              {
                required: true,
                message: "Enter the correct score for this question"
            
              },
            ]}>
              <Input readOnly={isTestEnded} placeholder="Enter the score for this question" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={['score', 'incorrect']} label="Incorrect Answer Score" required rules={[
              {
                required: true,
                message: "Enter the incorrect score for this question"
              }
            ]}>
              <Input readOnly={isTestEnded} placeholder="Enter the score for this question" />
            </Form.Item>
          </Col>
    

        </Row>
        <Row gutter={[20, 20]}>
          {questionType === 'subjective' ? <Col span={12}>
            <Form.Item label='Word Limit' name={'wordLimit'}>
              <Input type='number' />
            </Form.Item>
          </Col> : <Col span={24}>
            <Card style={{ marginBottom: 20 }} title="Answers">
              {questionType === Enum.TestQuestionType.NUMERIC ? <Form.Item label='Correct Numeric Answer' name={['answer', 'numeric']} >
                <Input type='number' />
              </Form.Item> : null}
              {(questionType === Enum.TestQuestionType.SINGLE || questionType === Enum.TestQuestionType.MULTIPLE) ? <Form.List name="options">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => {
                      const currentOption = options[index] || Constants.INITIAL_TEST_QUESTION_OPTION;
                      // console.log(currentOption,'currentOption')
                      return (
                        <Row justify={'center'} align={'middle'}>
                          <Col flex={1}>
                            <Form.Item
                              rules={[
                                { required: true, message: 'Please enter the answer.' },
                              ]}
                              {...restField}
                              name={[name, 'text', language]}
                            >
                              <TextArea uploadPrefixKey={prefixKey} height={150} html={enterHtml ? false : { level: 3 }} readOnly={isTestEnded} placeholder={`Answer ${index + 1}`} />
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
                                    if (questionType === Enum.TestQuestionType.SINGLE) {
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
                            }} style={{ marginLeft: 10, fontSize: 15 }} />
                          </Col>
                        </Row>
                      )
                    })}

                    <Button onClick={e => add()} icon={<PlusCircleTwoTone />}>Add Option</Button>
                  </>
                )}
              </Form.List> : null}
              {/* </OptionSelectedFormControl.Group> */}

            </Card>
          </Col>}

        </Row>
      </Card>
    </Col>
    {questionType === Enum.TestQuestionType.SUBJECTIVE && (
      <Col span={24}>
        <Card title="Scoring Criteria" extra={[
          <GenerateAIItemDetails onFinish={e => console.log(e, 'eee')} label='Generate Criteria using solution' field='criterias' />,
          <Tag style={{ marginLeft: 20 }} color='orange-inverse'>Total Score: {item.score.correct}</Tag>]}>
          {/* {totalCriteriaScore !== item.score.correct ?
          <Alert style={{marginBottom:20}} type='error' message='Criteria scores must always add up to be equal to the total score' /> : null} */}
          <Form.List name="criterias">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row key={key} align="middle" gutter={10}>
                    <Col>
                      <Form.Item {...restField}
                        name={[name, 'image']}>
                        {/* @ts-ignore */}
                        <MediaUpload name={[name, 'image']}
                          uploadType="image"
                          cropper
                          // width="100%"
                          height="100px"
                          aspect={16 / 9}
                          renderItem={() => (
                            <AppImage width={100} height={100} preview={false} src={(criterias && criterias[index])?.image} />
                          )}
                          onUpload={file => {
                            form.setFieldValue(['criterias', name, 'image'], file.url);

                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col flex="1">
                      <Form.Item
                        {...restField}
                        name={[name, 'criteria']}
                        rules={[{ required: true, message: 'Please enter the criteria' }]}
                      >
                        <TextArea uploadPrefixKey={prefixKey} height={200} placeholder="Enter scoring criteria" />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        {...restField} style={{ width: 100 }}
                        name={[name, 'score']}
                        rules={[{ required: true, message: 'Please enter the score' }]}
                      >
                        <Input type='number' min={1} max={10} placeholder="Score" />
                      </Form.Item>
                    </Col>
                    <Col>
                      <DeleteTwoTone
                        onClick={() => {
                          confirm({
                            title: 'Are you sure?',
                            content: 'You want to delete this criterion',
                            onOk() {
                              remove(name);
                            },
                            okText: 'Delete',
                          });
                        }}
                        style={{ fontSize: '24px', color: '#ff4d4f' }}
                      />
                    </Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusCircleTwoTone />}>
                  Add Criterion
                </Button>
              </>
            )}
          </Form.List>
        </Card>
      </Col>
    )}

    <Col span={24}>
 
      <Card title='Solution Text' >
        <Form.Item name={['solution', 'html',language]} required>
          <TextArea uploadPrefixKey={prefixKey}
            height={350} html={{ level: 3 }}
            // value={form.getFieldValue(['solution', 'html',language])}
            // onChange={(e: string) => form.setFieldsValue({ solution: { html: e } })}
          />
        </Form.Item>
      </Card>
    </Col>
    <Col span={24}>
      <Card style={{ marginTop: 20 }} title='Solution Video' extra={[<ActionModal cta={<Button icon={<UploadOutlined />}>{(file._id) ? 'Replace video' : 'Upload Solution Video'}</Button>}>
        <UploadVideo prefixKey={`test/${testId}/${itemId
          }/solution/video/index`} item={item}
          onUpload={(item) => {
            // console.log(item, 'item')
            // @ts-ignore
            updateItem({
              solution: {
                video: item.file + ''
              }
            })
          }
 
          }
        />
      </ActionModal>]}>
        {status === 'PROGRESSING' ? (
          <>
            <Title level={3} style={{ marginTop: 0 }}> Processing Video...</Title>
            <Progress style={{ marginBottom: 20 }} percent={progress} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
          </>
        ) : null}
        {file._id ? <MediaPlayer fileId={fileId} /> : <Empty description='No Video Uploaded' />}
      </Card>
    </Col>

  </Row>
</Form>
  return (
    <Spin spinning={false} >
      <Tabs type='card' items={Constants.LANGUAGES.filter(t=>test.languages.includes(t.value)).map(language => {
        return {
          label: language.label,
          key: language.value,
          children:getFormComponent(language.value)
       }
     })} />
    <Button loading={deletingSectionItem} type='primary' danger onClick={DeleteSectionItem} >Delete Question</Button>
    </Spin>
  )
}

export default AddQuestion
