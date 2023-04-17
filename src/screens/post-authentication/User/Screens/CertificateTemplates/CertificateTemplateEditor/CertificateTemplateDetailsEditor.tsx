// @ts-nocheck

import { Common, Store, Types, User } from '@adewaskar/lms-common'
import { Form, Input, Space, Tag, Typography, } from 'antd';
import React, { Fragment, useRef, useState } from 'react';

import { GetBaseCertificateTemplate } from '@User/Screens/Courses/CourseBuilder/CourseEditor/CourseCertificate/Constant';
import HtmlEditor from '@Components/HtmlEditor';
import { useParams } from 'react-router';

const { Text } = Typography;

const VARIABLES = [
  {
    name: 'Course Title',
    value: 'course.title'
  },
  {
    name: 'Course Instructor',
    value: 'course.instructor.name'
  },
  {
    name: 'Learner Name',
    value: 'title'
  },
  {
    name: 'Course Completion Date',
    value: 'course.completedAt'
  }
]


interface CreateCertificateTemplateComponentPropsI {
  id?: string;
}

const CertificateTemplateDetailsEditor: React.FC<CreateCertificateTemplateComponentPropsI> = (props) => {
  const { id } = useParams();
  const {organisation}=Store.useGlobal(s=>s)
  const templateId = props.id || id;
  const { data: template } = User.Queries.useGetCertificateTemplateDetails(templateId);
  const { useWatch } = Form;
  const form = Form.useFormInstance<Types.CertificateTemplate>();

  
  console.log(organisation.logo,'organisation.logo')

  const html = useWatch(['template'], form);
  return <Space direction='vertical'>
   <Space direction="vertical" style={{ marginBottom: 30 }}>
              <Space size={[0, 8]} wrap>
                {VARIABLES.map(variable => (
                  <Tag color="default">{variable.name}</Tag>
                ))}
              </Space>
    </Space>
  <HtmlEditor variables={VARIABLES} onChange={e=>form.setFieldValue('template')} />
</Space>

};

export default CertificateTemplateDetailsEditor;
