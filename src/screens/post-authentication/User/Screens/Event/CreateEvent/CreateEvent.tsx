import AddOutcome, { Outcome } from '../../ExtraComponents/Outcomes/AddOutcome'
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tag,
} from 'antd'
import { Enum, Types } from '@invinciblezealorg/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddTestimonial from '../../ExtraComponents/Testimonials/AddTestomonial'
import CreatePlan from '@User/Screens/ExtraComponents/CreatePlan'
import EventOutcomes from '../../ExtraComponents/Outcomes/Outcomes'
import EventTestimonials from '../../ExtraComponents/Testimonials/Testimonials'
import Header from '@Components/Header'
import Image from '@Components/Image'
import LocationAutocomplete from '@Components/LocationSelector'
import LocationSelector from '@Components/LocationSelector'
import MediaUpload from '@Components/MediaUpload'
import PriceFormItem from '@Components/PriceFormItem'
import TextArea from '@Components/Textarea'
import { User } from '@invinciblezealorg/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'

const { confirm} = Modal;
interface CreateEventComponentPropsI {
  children?: ReactNode;
  closeModal?: Function;
  onSuccess?: () => void;
  onFinish?: (data: Types.Event) => void;
}

const CreateEvent: React.FC<CreateEventComponentPropsI> = props => {
  const { eventId } = useParams();
  const isUpdate = !!eventId;
  console.log(isUpdate,'ddd')
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [testimonials, setTestimonials] = useState<Types.Testimonial[]>([]);
  const navigate = useNavigate();
  const {
    mutate: createEvent,
    isLoading: createEventLoading
  } = User.Queries.useCreateEvent()
  const {
    mutate: updateEvent,
    isLoading: updateEventLoading
  } = User.Queries.useUpdateEvent()

  const {data: eventDetails,isFetching: loadingEvent}=User.Queries.useGetEventDetails(eventId+'',{
    enabled:!!eventId
  })

  const [form] = Form.useForm<Types.CreateEventPayload>()

  const onSubmit = (status?: Enum.EventStatus) => {
    const e: Types.CreateEventPayload = form.getFieldsValue();
    console.log(e, 'e')
    
    const data= {
      ...e,
      testimonials,
      outcomes
    }
    if (status) {
      data.status = status;
    }
    if (isUpdate) {
      updateEvent(
        { id: eventId, data:data },
        {
          onSuccess: () => {
            form.resetFields();
            navigate('../')
            props.onSuccess && props.onSuccess();
            props.closeModal && props.closeModal();
          }
        }
      )
    } else {
      createEvent(data, {
        onSuccess: () => {
          navigate('../')
          props.onSuccess && props.onSuccess();
          props.closeModal && props.closeModal()
        }
      })
    }
    // onFinish && onFinish(e)
  }

  useEffect(
    () => {
      if (eventDetails.scheduledAt) {
        const scheduledAt=dayjs(eventDetails.scheduledAt);
        console.log(eventDetails, 'eventDetails')
        // @ts-ignore
        form.setFieldsValue({...eventDetails,scheduledAt})
        
      }
    },
    [eventDetails]
  )
  const image = Form.useWatch('image', form);

  const date = dayjs(Form.useWatch('scheduledAt', form));
  const {mutate: unpublishEvent,isLoading: unpublishingEvent } = User.Queries.useUnpublishEvent();
  const UnpublishButton = <Button type='primary' loading={unpublishingEvent} onClick={() => {
    confirm({
      title: 'Are you sure?',
      content: `You want to unpublish this event`,
      onOk() {
        unpublishEvent({
          eventId:eventId+''
        })
      },
      okText: 'Yes, Publish'
    })
  }} >Unpublish Event</Button>

  const PublishEvent = <Button
    loading={createEventLoading || updateEventLoading}
    // key="submit"
    type="primary"
    // htmlType='submit'
    onClick={() => {
      form.validateFields() // Trigger validation manually
        .then(() => {
          // Validation successful, show the confirm dialog
          confirm({
            title: 'Are you sure?',
            content: `You want to publish this event`,
            onOk() {
              // form.setFieldsValue({ status: Enum.EventStatus.PUBLISHED });
              onSubmit(Enum.EventStatus.PUBLISHED);
            },
            okText: 'Yes, Publish'
          })
        })
        .catch(errorInfo => {
          // Validation failed, errors are present
          console.error('Validate Failed:', errorInfo);
        });
      // onSubmit()
    }}      >
    Publish Event
  </Button>;

  const UpdateEvent = <Button
    loading={updateEventLoading}
    style={{ marginRight: 20 }}
    // type="primary"
    onClick={() => {
      // form.setFieldsValue({ status: Enum.EventStatus.DRAFT });
      onSubmit()
    }}
  >
    Update Event
  </Button>;
  
  const qc = useQueryClient();
  return (
    <Header showBack title={isUpdate ? `${eventDetails.title}` : `Create Event`}
      extra={eventDetails.status===Enum.EventStatus.PUBLISHED?[UpdateEvent,<Tag color='green' >Event is published</Tag>,UnpublishButton]:[
        isUpdate ? <>
          {eventDetails.status === Enum.EventStatus.DRAFT ? <>
            {UpdateEvent} {eventDetails.plan? PublishEvent:      <ActionModal cta={<Button type='primary'>Add Plan and Publish</Button> }>
              <CreatePlan onSuccess={()=>qc.invalidateQueries([`GET_EVENT_DETAILS`, eventId])} product={{ type: 'event', id: eventDetails._id }} />
            </ActionModal>} </> : null}
        </> : <>
        <Button
      loading={createEventLoading}
     style={{marginRight:20}}
      // type="primary"
      onClick={() => {
        // form.setFieldsValue({ status: Enum.EventStatus.DRAFT });
        onSubmit(Enum.EventStatus.DRAFT);
      }}
      >
      Save as Draft
            </Button>
            {PublishEvent}
          </>
    ]}>
        <Card loading={loadingEvent}>
      <Row>
        <Col span={24}>
      <>
              <Form form={form} layout="vertical">
                <Row gutter={[20,20]}>
                  <Col span={16}>
                  <Form.Item
        rules={[
          { required: true, message: 'Please enter a title of the events' }
        ]}
        name="title"
        label="Event Title"
        required
      >
        <Input placeholder="Enter a title for the live session" />
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
            <DatePicker style={{width: '100%'}} value={date} showTime  />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter duration of the Event'
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
                    type: 'event.thumbnail',
                    value: eventId + ''
                  }}
                  uploadType="image"
                  // prefixKey={`events/${eventId}/image`}
                  cropper={{width: 330,height:200}}
                  width="100%"
                  // height="200px"
                  aspect={16 / 9}
                  renderItem={() => (
                    <Image preview={false} src={image} />
                  )}
                      onUpload={file => {
                    console.log(file,'uploaded image!')
                    form.setFieldValue('thumbnailImage', file.url)
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
            message: 'Please enter a description of the events'
          }
        ]}
        name={["description"]}
        required
      >
                      <TextArea height={250} html label="Description" name={["description"]} />
                      
                    </Form.Item>
                  </Col>
      <Col span={12}>
      <Form.Item name='type' label='Event Type'>
<Select
          options={[
            { label: 'Webinar', value: Enum.EventType.WEBINAR },
                          { label: 'Conversational', value: Enum.EventType.CONVERSATIONAL },
                          { label: 'Offline', value: Enum.EventType.OFFLINE }

          ]}
        />
        </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Record Session' name={['recording', 'enabled']}>
        <Checkbox name="recording.enabled">
          <VideoCameraOutlined /> 
        </Checkbox>
      </Form.Item>
                  </Col>
                  <Col span={12}>
                  <Form.Item label='Event Location'>
    <LocationAutocomplete onLocationChange={console.log} />
  </Form.Item>

                  </Col>
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
      </Row>
    </Form>
            </>
            <Card title='Outcomes' extra={<ActionModal cta={<Button type='primary'>Add Outcome</Button>}>
              <AddOutcome submit={(e: Outcome) => {
                console.log(e,'e')
                setOutcomes([...outcomes, e]);
              }}/>
            </ActionModal>}>
              <EventOutcomes deleteItem={(index:number) => {
                  const OUTCOMES = [...outcomes];
                  OUTCOMES.splice(index,1)
                setOutcomes(OUTCOMES);
              }} outcomes={outcomes} submit={(index: number,e:Outcome) => {
                const OUTCOMES = [...outcomes];
                OUTCOMES[index] = e;
                setOutcomes(OUTCOMES)
         }}  />
            </Card>
            <Card title='Testimonials' extra={<ActionModal cta={<Button type='primary'>Add Testimonial</Button>}>
              <AddTestimonial submit={(e: Types.Testimonial) => {
                console.log(e,'e')
                setTestimonials([...testimonials, e]);
              }}/>
            </ActionModal>}>
              <EventTestimonials deleteItem={index => {
                  const TESTIMONIALS = [...testimonials];
                  TESTIMONIALS.splice(index,1)
                setTestimonials(TESTIMONIALS);
              }} testimonials={testimonials} submit={(index: number,e:Types.Testimonial) => {
                const TESTIMONIALS = [...testimonials];
                TESTIMONIALS[index] = e;
                setTestimonials(TESTIMONIALS)
         }}  />
           </Card>
        </Col>

    </Row>
    </Card>
    </Header>
  )
}

export default CreateEvent
