import AddOutcome, { Outcome } from '../../ExtraComponents/Outcomes/AddOutcome'
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
  Table,
} from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal'
import AddTestimonial from '../../ExtraComponents/Testimonials/AddTestomonial'
import Header from '@Components/Header'
import Image from '@Components/Image'
import EventOutcomes from '../../ExtraComponents/Outcomes/Outcomes'
import EventTestimonials from '../../ExtraComponents/Testimonials/Testimonials'
import MediaUpload from '@Components/MediaUpload'
import PriceFormItem from '@Components/PriceFormItem'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useParams } from 'react-router'

interface CreateEventComponentPropsI {
  children?: ReactNode;
  closeModal?: Function;
  onFinish?: (data: Types.Event) => void;
}

const CreateEvent: React.FC<CreateEventComponentPropsI> = props => {
  const { sessionId } = useParams();
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [testimonials, setTestimonials] = useState<Types.Testimonial[]>([]);

  const {
    mutate: createEvent,
    isLoading: createEventLoading
  } = User.Queries.useCreateEvent()
  const {
    mutate: updateEvent,
    isLoading: updateEventLoading
  } = User.Queries.useUpdateEvent()

  const {data: sessionDetails}=User.Queries.useGetEventDetails(sessionId+'',{
    enabled:!!sessionId
  })

  const [form] = Form.useForm<Types.CreateEventPayload>()

  const onSubmit = (e: Types.CreateEventPayload) => {
    const data= {
      ...e,
      testimonials,
      outcomes
    }
    if (sessionId) {
      updateEvent(
        { id: sessionId, data:data },
        {
          onSuccess: () => {
            form.resetFields();
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createEvent(data, {
        onSuccess: () => {
          props.closeModal && props.closeModal()
        }
      })
    }
    // onFinish && onFinish(e)
  }

  useEffect(
    () => {
      form.setFieldsValue(sessionDetails)
    },
    [sessionDetails]
  )
  const image = Form.useWatch('image', form);

  const date = dayjs(Form.useWatch('scheduledAt', form))


  return (
    <Header showBack title='Create Event' extra={[<Button
      loading={createEventLoading || updateEventLoading}
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
        label="Session Title"
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
            <DatePicker value={date} showTime  />
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
                    value: sessionId + ''
                  }}
                  uploadType="image"
                  // prefixKey={`events/${sessionId}/image`}
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
      <Col span={12}>
      <Form.Item name='type' label='Session Type'>
<Select
          options={[
            { label: 'Webinar', value: 'webinar' },
            { label: 'Conversational', value: 'conversational' }
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
