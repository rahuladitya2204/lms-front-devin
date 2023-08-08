import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Switch,
    Table,
  } from 'antd'
  import React, { Fragment, ReactNode, useEffect, useState } from 'react'
  
  import Header from '@Components/Header'
  import Image from '@Components/Image'
  import MediaUpload from '@Components/MediaUpload'
  import PriceFormItem from '@Components/PriceFormItem'
  import TextArea from '@Components/Textarea'
  import { Types } from '@adewaskar/lms-common'
  import { User } from '@adewaskar/lms-common'
  import dayjs from 'dayjs'
  import { useParams } from 'react-router'
  import ActionModal from '@Components/ActionModal'
  import AddOutcome, { Outcome } from '../ExtraComponents/Outcomes/AddOutcome'
  import LiveTestOutcomes from '../ExtraComponents/Outcomes/Outcomes'
  import AddTestimonial from '../ExtraComponents/Testimonials/AddTestomonial'
  import LiveTestTestimonials from '../ExtraComponents/Testimonials/Testimonials'
import AddQuestion from '../ExtraComponents/TestQuestions/AddQuestion'
import { PlusOutlined } from '@ant-design/icons'
import GenerateWithAI from '../Courses/CourseEditor/CourseInformation/GenerateWithAiButton'
import Questions from '../ExtraComponents/TestQuestions/Questions'
  
  interface CreateLiveTestComponentPropsI {
    children?: ReactNode;
    closeModal?: Function;
    onFinish?: (data: Types.LiveTest) => void;
  }
  
  const CreateLiveTest: React.FC<CreateLiveTestComponentPropsI> = props => {
    const { testId } = useParams();
    const [questions, setQuestions] = useState<Types.LiveTestQuestion[]>([]);
    const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [testimonials, setTestimonials] = useState<Types.Testimonial[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const {
      mutate: createLiveTest,
      isLoading: createLiveTestLoading
    } = User.Queries.useCreateLiveTest()
    const {
      mutate: updateLiveTest,
      isLoading: updateLiveTestLoading
    } = User.Queries.useUpdateLiveTest()
  
      const { data: liveTestDetails } = User.Queries.useGetLiveTestDetails(testId + '', {
          enabled: !!testId
      });
  
    const [form] = Form.useForm<Types.CreateLiveTestPayload>()
  
    const onSubmit = (e: Types.CreateLiveTestPayload) => {
      const data= {
        ...e,
          questions,
          testimonials,
          outcomes
      }
      if (testId) {
        updateLiveTest(
          { id: testId, data:data },
          {
            onSuccess: () => {
              form.resetFields();
              props.closeModal && props.closeModal()
            }
          }
        )
      } else {
        createLiveTest(data, {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        })
      }
    }

    const image = Form.useWatch('image', form);
    const title = Form.useWatch('title', form);
    const duration = Form.useWatch('duration', form);
    // const scheduledAt = Form.useWatch('scheduledAt', form);
    const date = dayjs(Form.useWatch('scheduledAt', form))

    const isValidForDraft = title && date && questions.length;
  
    return (
      <Header showBack title='Create Live Test' extra={[
        <Button
        loading={createLiveTestLoading || updateLiveTestLoading}
        key="submit"
        disabled={!isValidForDraft}
        onClick={form.submit}
        >
        Save as Draft
              </Button>,<Button
        loading={createLiveTestLoading || updateLiveTestLoading}
        key="submit"
        type="primary"
        onClick={form.submit}
        >
        Publish
              </Button>]}>
          <Card>
        <Row>
          <Col span={24}>
        <>
                <Form form={form} onFinish={onSubmit} layout="vertical">
                  <Row gutter={[20,20]}>
                    <Col span={16}>
                    <Form.Item
          rules={[
            { required: true, message: 'Please enter a title of the Live Stream' }
          ]}
          name="title"
          label="Test Title"
          required
        >
          <Input placeholder="Enter a title for the live test" />
        </Form.Item>
                      <Row gutter={[10, 10]}>
          <Col span={12}>
   <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please enter start time for the livestream'
                }
              ]}
              name="scheduledAt"
              label="Scheduled For"
              required
            >
              <DatePicker value={date} showTime  />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please enter duration of the Live Test'
                }
              ]}
              name="duration"
              label="Duration(mins)"
              required
            >
              <Input
                type="number"
                placeholder="Please enter duration in minutes"
              />
            </Form.Item>
          </Col>
        </Row>
                    </Col>
                    <Col span={8}>
          <MediaUpload
                    source={{
                      type: 'LiveTest.thumbnail',
                      value: testId + ''
                    }}
                    uploadType="image"
                    // prefixKey={`live-tests/${testId}/image`}
                    cropper
                    width="100%"
                    // height="200px"
                    aspect={16 / 9}
                    renderItem={() => (
                      <Image preview={false} src={image} />
                    )}
                        onUpload={file => {
                      console.log(file,'uploaded image!')
                      form.setFieldValue('image', file.url)
                    }}
                  />
          </Col>
                  </Row>
                  <Row gutter={[20, 20]}>
                    <Col span={24}>
                    <Form.Item
          rules={[
            {
              required: true,
              message: 'Please enter a description of the Live Stream'
            }
          ]}
          name={["description"]}
          required
        >
          <TextArea label="Description" name={["description"]}/>
                      </Form.Item>
                    </Col>
        </Row>
  
          <Row gutter={[20,20]}>
                    <Col span={12}>
                      <Form.Item label="Access Type" name="accessType">
          <Select
            options={[
              { label: 'Learners', value: 'learner' },
              { label: 'Open for all', value: 'open' }
            ]}
          />
        </Form.Item>
            </Col>
            <Col span={12}>  <PriceFormItem name="price" label="Price" /></Col>
        </Row>
      </Form>
              </>
                        <Row gutter={[30, 30]}>
                            <Col span={24}>
                            <Card
              style={{ marginBottom: 20 }}
              title="Questions"
              extra={[
                <ActionModal
                  width={650}
                  cta={
                    <Button disabled={!(title&&duration)}
                      style={{ marginLeft: 10 }}
                      size="small"
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={e => {
                        if (!(title && duration)) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      Add
                    </Button>
                  }
                >
                  <AddQuestion
                    submit={question => {
                      setQuestions([...questions, question])
                    }}
                  />
                </ActionModal>
              ]}
            >
              <Questions
                onUpdate={(index,question) => {
                  const newQuestions = [...questions]
                  newQuestions.forEach((q, index) => {
                    if (q._id === question._id) {
                      newQuestions[index] = question
                    }
                  })
                  setQuestions(newQuestions)
                }}
                data={questions}
           deleteItem={(item,index) => {
               const TESTIMONIALS = [...testimonials];
               TESTIMONIALS.splice(index,1)
             setTestimonials(TESTIMONIALS);
                }}
              />
            </Card>
                </Col>
                <Col span={24}>
                <Form.Item label='Advanced'>
                  <Switch checked={showAdvanced} onChange={setShowAdvanced} />
                </Form.Item>
                </Col>
                {showAdvanced?<Fragment><Col span={24}>
               
                           
               <Card title='Outcomes' extra={<ActionModal cta={<Button type='primary'>Add Outcome</Button>}>
   <AddOutcome submit={(e: Outcome) => {
     console.log(e,'e')
     setOutcomes([...outcomes, e]);
   }}/>
 </ActionModal>}>
   <LiveTestOutcomes deleteItem={index => {
       const OUTCOMES = [...outcomes];
       OUTCOMES.splice(index,1)
     setOutcomes(OUTCOMES);
   }} outcomes={outcomes} submit={(index: number,e:Outcome) => {
     const OUTCOMES = [...outcomes];
     OUTCOMES[index] = e;
     setOutcomes(OUTCOMES)
}}  />
 </Card>
               </Col>
               <Col span={24}>
               <Card title='Testimonials' extra={<ActionModal cta={<Button type='primary'>Add Testimonial</Button>}>
   <AddTestimonial submit={(e: Types.Testimonial) => {
     console.log(e,'e')
     setTestimonials([...testimonials, e]);
   }}/>
 </ActionModal>}>
   <LiveTestTestimonials deleteItem={(index:number) => {
       const TESTIMONIALS = [...testimonials];
       TESTIMONIALS.splice(index,1)
     setTestimonials(TESTIMONIALS);
   }} testimonials={testimonials} submit={(index: number,e:Types.Testimonial) => {
     const TESTIMONIALS = [...testimonials];
     TESTIMONIALS[index] = e;
     setTestimonials(TESTIMONIALS)
}}  />
</Card>
               </Col></Fragment>: null}
           </Row>
          </Col>
  
      </Row>
      </Card>
      </Header>
    )
  }
  
  export default CreateLiveTest
  