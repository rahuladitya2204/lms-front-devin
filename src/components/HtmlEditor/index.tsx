// @ts-nocheck
import './style.css'

import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  BoldOutlined,
  FileImageOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import { Button, Dropdown, Form, Input, Space, Tag, Typography } from 'antd'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import ContentEditable from 'react-contenteditable'
import { GetBaseCertificateTemplate } from '@User/Screens/Courses/CourseBuilder/CourseEditor/CourseCertificate/Constant'
import interact from 'interactjs'
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
  const [Text, setText] = useState(props.value || GetBaseCertificateTemplate({}));
  const contentEditableRef = useRef(null)

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
    // console.log(text.current)
  }
  const handleCommand = (command, value) => {
    document.execCommand(command, false, value)
  }

  const fileInput = useRef(null)

  const handleImageUpload = event => {
    const file = event.target.files[0]
    if (file && file.type.match('image.*')) {
      const reader = new FileReader()
      reader.onload = e => {
        const img = `<img class="resizable-image" width="30" src="${
          e.target.result
        }" />`
        handleCommand('insertHTML', img)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    interact('.resizable-image')
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true }
      })
      .on('resizemove', event => {
        const target = event.target
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'
        target.style.transform = `translate(${x}px, ${y}px)`

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      })

    return () => {
      interact('.resizable-image').unset()
    }
  }, [])

  const savedSelectionRef = useRef(null)

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0)
    }
  }

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(savedSelectionRef.current)
    }
  }

  const handleVariableInsert = ({ value, name }) => {
    restoreSelection()

    const variableSpan = document.createElement('span')
    variableSpan.setAttribute('data-variable-value', value)
    variableSpan.classList.add('variable')
    variableSpan.textContent = name

    const selection = window.getSelection()
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(variableSpan)

      // Trigger onChange event
      const changeEvent = new Event('input', { bubbles: true })
      // console.log(contentEditableRef?.current, 'changeEvent')
      contentEditableRef?.current?.el?.current?.dispatchEvent(changeEvent)
    }
  }
  // console.log(Text, 'triggered')

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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={fileInput}
        />
        <Button
          // onFocus={saveSelection}
          // onChange={e => {
          //   const selectedOption = variables.find(
          //     variable => variable.value === e.target.value
          //   )
          //   if (selectedOption) {
          //     handleVariableInsert(selectedOption.value, selectedOption.label)
          //   }
          //   restoreSelection() // Call restoreSelection() here instead of onBlur
          // }}
          icon={<FileImageOutlined />}
          onClick={() => {
            fileInput.current.click()
          }}
        />
        {props.variables ? (
          <Dropdown
            onOpenChange={e => saveSelection()}
            menu={{
              items: props.variables?.map(v => {
                return {
                  label: (
                    <span
                      onClick={() => {
                        handleVariableInsert(v)
                      }}
                    >
                      {v.name}
                    </span>
                  ),
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
        ref={contentEditableRef}
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
      {...props}
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
