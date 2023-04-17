// @ts-nocheck
import './style.css'

import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import { Button, Dropdown, Form, Input, Space, Tag, Typography } from 'antd'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import ContentEditable from 'react-contenteditable'
import { GetBaseCertificateTemplate } from '@User/Screens/Courses/CourseBuilder/CourseEditor/CourseCertificate/Constant'
import { useParams } from 'react-router'

interface HtmlEditorPropsI {
  value?: string;
  variables?: {
    name: string,
    value: string
  }[];
  onChange: Function;
}

const HtmlEditor: React.FC<HtmlEditorPropsI> = props => {
  const [Text, setText] = useState(GetBaseCertificateTemplate({}))
  const handleChange = evt => {
    setText(evt.target.value)
  }

  useEffect(
    () => {
      props.onChange(Text)
    },
    [Text]
  )

  const handleBlur = () => {
    console.log(text.current)
  }
  return (
    <Space direction="vertical">
      <Space>
        <EditButton icon={<ItalicOutlined />} cmd="italic" />
        <EditButton icon={<BoldOutlined />} cmd="bold" />
        <EditButton icon={<UnderlineOutlined />} cmd="underline" />
        <EditButton icon={<OrderedListOutlined />} cmd="insertOrderedList" />
        <EditButton
          icon={<UnorderedListOutlined />}
          cmd="insertUnorderedList"
        />
        {/* <EditButton cmd="formatBlock" arg="h1" name="heading" ></EditButton> */}
        <Dropdown
          menu={{
            items: [
              {
                key: 'h1',
                label: (
                  <EditButton cmd="formatBlock" arg="h1" name="heading">
                    Heading H1
                  </EditButton>
                )
              },
              {
                key: 'h2',
                label: (
                  <EditButton cmd="formatBlock" arg="h2" name="heading">
                    Heading H2
                  </EditButton>
                )
              }
            ]
          }}
          placement="bottomLeft"
        >
          <Button>Heading</Button>
        </Dropdown>
        <Dropdown
          menu={{
            items: [
              {
                key: 'h1',
                label: (
                  <EditButton cmd="justifyLeft" icon={<AlignLeftOutlined />} />
                )
              },
              {
                key: 'h2',
                label: (
                  <EditButton
                    icon={<AlignCenterOutlined />}
                    cmd="justifyCenter"
                    name="heading"
                  />
                )
              }
            ]
          }}
          placement="bottomLeft"
        >
          <Button icon={<AlignLeftOutlined />} />
        </Dropdown>
        {props.variables ? (
          <Dropdown
            menu={{
              items: props.variables?.map(v => {
                return {
                  label: v.name,
                  key: v.value
                }
              })
            }}
            placement="bottomLeft"
          >
            <Button>Variables</Button>
          </Dropdown>
        ) : null}
      </Space>
      <ContentEditable
        html={Text}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </Space>
  )
}

export default HtmlEditor

function EditButton(props) {
  return (
    <Button
      key={props.cmd}
      // size="middle"
      onMouseDown={evt => {
        evt.preventDefault() // Avoids loosing focus from the editable area
        document.execCommand(props.cmd, false, props.arg) // Send the command to the browser
      }}
      // shape="circle"
      icon={props.icon}
    >
      {' '}
      {props.children}
    </Button>
  )
}
