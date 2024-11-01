import { Button, Form, Input, Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

import { AddItemProps } from '../UploadItems/UploadPDF';
import { Types } from '@adewaskar/lms-common'

const CreateQuizItem: React.FC<Types.CreateItemPropsI> = (props: AddItemProps) => {
  return (
    <>
      <Form.Item rules={[{ required: true, message: 'Please mention title for Quiz' }]} name="title" label="Quiz Title">
        <Input />
      </Form.Item>
      <Button key="submit" type="primary" htmlType='submit'>
        Submit
      </Button>
    </>
  );
};

export default CreateQuizItem;