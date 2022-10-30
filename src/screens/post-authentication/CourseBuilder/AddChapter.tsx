import { ArrowLeftOutlined, EditOutlined, EyeOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Modal, Radio, Row, Space, Typography } from 'antd'

import CreateHeading from './CreateNewItem/CreateHeading';
import UploadPDF from './UploadItems/UploadPDF';
import styled from '@emotion/styled';
import { useGetCourses } from '../../../queries/Courses/CoursesHooks'
import { useState } from 'react'

const { Title } = Typography;

const AddChapterButton = styled(Button)`
margin-top: 20px;
`

const UPLOAD_ITEMS = [
    {
        name: 'PDF',
        description: 'Add a PDF file in the course.',
        key: 'pdf',
        Component: UploadPDF

    },
    // {
    //     name: 'Video',
    //     description: 'All uploaded videos are completely secure and non downloadable. It can also be used to embed youtube and Vimeo videos.',
    //     key:'video'
    // },
    // {
    //     name: 'Audio',
    //     key:'audio'
    // },
    // {
    //     name: 'File',
    //     description:'Add any file type for learners to download.',
    //     key:'file'
    // }
]

const CREATE_ITEM = [
    {
        name: 'Heading',
        description: 'Define your chapter or section headings..',
        key:'heading'
    },
    {
        name: 'Text',
        description: 'Create your textual lessons in the course. It can also be used to embed iFrame, add HTML code through the Source option.',
        key:'text'
    },
    {
        name: 'Link',
        description:'Add Link which will be embedded in iFrame.',
        key:'link'
    },
    {
        name: 'Quiz',
        description: 'Learners can attempt it any time and view instant results.',
        key:'Quiz'
    },
]

function AddChapterScreen () {
  const { data: courses } = useGetCourses()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
    const [form] = Form.useForm();
    const loading = false;
    const onSubmit = () => {
        console.log('onSubmit')
    }
  return (
    <>
    <AddChapterButton  block type="primary" onClick={showModal}>
      Add New Chapter
    </AddChapterButton>
    <Modal style={{minWidth:750}} title="Create Course" open={isModalOpen} onCancel={closeModal}>
                <Form
                form={form}
                onFinish={onSubmit}
      layout="vertical"
              >
                      <Radio.Group>

                     <Row gutter={[16, 24]}>
                      <Col span={12}>
                      <Title level={4}>
                              Upload new Item
                          </Title>
                              <Space direction="vertical">
                                  <UploadPDF onFinish={console.log}>  <Radio name={'pdf'} value={'pdf'}>
                                      <Typography.Text strong>
                                          PDF:
                                      </Typography.Text> Add a PDF file in the course
                                  </Radio>
                                  </UploadPDF>
                              {/* {UPLOAD_ITEMS.map(Item => {
                                  return <Item.Component onFinish={}>
                                      <Radio name={Item.key} value={Item.key}>
                                          <Typography.Text strong>{Item.name}</Typography.Text>{Item.description ? `: ${Item.description}` : ''}
                                      </Radio>
                                  </Item.Component>
                              })} */}
       
</Space>
        </Col>
                      <Col span={12}>
                      <Title level={4}>
                              Create New Item
                          </Title>
                              <Space direction="vertical">
<CreateHeading onFinish={console.log}>  <Radio value={'headingName'}> <Typography.Text strong>
                                      Heading: 
                                  </Typography.Text> Define your chapter or section headings.. </Radio></CreateHeading>
                             
       
</Space>
        </Col>
      </Row>
</Radio.Group>
    </Form>

    </Modal>
  </>
  )
}

export default AddChapterScreen
