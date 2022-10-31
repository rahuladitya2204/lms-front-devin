import { Button, Col, Form, Modal, Radio, Row, Space, Typography } from 'antd'

import CreateHeading from './CreateNewItem/CreateHeading';
import UploadPDF from './UploadItems/UploadPDF';
import styled from '@emotion/styled';
import { useState } from 'react'

const { Title } = Typography;



interface AddItemPropsI {
  onAddNewItem: (type: string, value: string,key?:string) => void;
  children?: React.ReactNode;
}

function AddItem (props:AddItemPropsI) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
    const [form] = Form.useForm();
    const onFinish = (type:string,value:string) => {
        props.onAddNewItem(type, value);
                                      closeModal();
    }
  return (
    <>
      <span onClick={showModal}>{props.children}</span>
    
    <Modal footer={false} style={{minWidth:750}} title="Create Course" open={isModalOpen} onCancel={closeModal}>
                <Form
                form={form}
      layout="vertical"
              >
                      <Radio.Group>

                     <Row gutter={[16, 24]}>
                      <Col span={12}>
                      <Title level={4}>
                              Upload new Item
                          </Title>
                              <Space direction="vertical">
                                  <UploadPDF onFinish={(e)=> onFinish('pdf',e)}>  <Radio name={'pdf'} value={'pdf'}>
                                      <Typography.Text strong>
                                          PDF:
                                      </Typography.Text> Add a PDF file in the course
                                  </Radio>
                                  </UploadPDF>
</Space>
        </Col>
                      <Col span={12}>
                      <Title level={4}>
                              Create New Item
                          </Title>
                              <Space direction="vertical">
                                  <CreateHeading onFinish={(e) => {
                                      onFinish('heading',e)
}}>  <Radio value={'headingName'}> <Typography.Text strong>
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

export default AddItem
