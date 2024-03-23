// @ts-nocheck
// import '@ckeditor/ckeditor5-build-classic/build/translations/en'
import './style.css'

import { Col, Form, Row, Spin, Tag } from 'antd'
import { Common, Types } from '@invinciblezealorg/lms-common'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import EditorType from '@ckeditor/ckeditor5-build-decoupled-document'
import { MyUploadAdapter } from './ImageUploadPlugin'
import { uniqueId } from 'lodash'

// import './style.css' // Your CSS file path

interface CKEditorPropsI {
  height?: number;
  width?: number;
  name?: string | string[];
  variables?: Types.Variable[];
  uploadPrefixKey?: string;
  value?: string;
  mode?: string;
  readonly?: boolean;
  imageBase64?: boolean;
  onChange?: (d: string) => void;
  defaultValue?: string;
  level?: 1 | 2 | 3; // Levels to control the editor features
}

const CKEditorComponent = (props: CKEditorPropsI) => {
  const editorRef = useRef()
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()

  const handleUpload = file => {
    return new Promise((resolve, reject) => {
      uploadFiles({
        files: [{ file, prefixKey: props.uploadPrefixKey }],
        isProtected: false,
        onUploadProgress: e => {
          console.log(e, 'Upload Progress')
        },
        onSuccess: ([uploadedFile]) => {
          resolve({ default: uploadedFile.url })
        },
        onError: error => {
          console.error('Upload failed', error)
          reject(error)
        }
      })
    })
  }
  const toolbarContainerRef = useRef(null)
  const [editorLoaded, setEditorLoaded] = useState(false)

  useEffect(
    () => {
      if (editorRef.current && toolbarContainerRef.current && editorLoaded) {
        toolbarContainerRef.current.appendChild(
          editorRef.current.ui.view.toolbar.element
        )
        // editorRef.current.editing.view.change(writer => {
        //   writer.setStyle(
        //     'height',
        //     props.height ? `${props.height}px` : '400px',
        //     editorRef.current.editing.view.document.getRoot()
        //   )
        //   writer.setStyle(
        //     'width',
        //     props.width ? `${props.width}px` : '100%',
        //     editorRef.current.editing.view.document.getRoot()
        //   )
        // })
      }
    },
    [editorLoaded, props.height, props.width]
  )

  return (
    <Fragment>
      <Spin spinning={loading}>
        <Row gutter={[20, 10]} style={{ marginBottom: 20 }}>
          <Col span={24}>
            {props.variables?.map(variable => (
              <Tag
                color="blue"
                style={{ cursor: 'pointer' }}
                key={uniqueId('var_')}
                onClick={() =>
                  editorRef.current.editor.execute(
                    'insertText',
                    `{{${variable.value}}}`
                  )
                }
              >
                {variable.name}
              </Tag>
            ))}
          </Col>
        </Row>

        <div ref={toolbarContainerRef} />
        <CKEditor
          editor={EditorType}
          data={props.value || ''}
          onChange={(event, editor) => {
            const data = editor.getData()
            if (props.onChange) {
              props.onChange(data)
            }
          }}
          onReady={editor => {
            // Ensure toolbarContainerRef is not null and editor UI has been initialized
            if (
              toolbarContainerRef.current &&
              editor &&
              editor.ui &&
              editor.ui.view &&
              editor.ui.view.toolbar
            ) {
              console.log('Appending toolbar')

              // Clear existing contents in the toolbar container to prevent duplication
              while (toolbarContainerRef.current.firstChild) {
                toolbarContainerRef.current.removeChild(
                  toolbarContainerRef.current.firstChild
                )
              }

              // Append the toolbar element to your toolbar container
              toolbarContainerRef.current.appendChild(
                editor.ui.view.toolbar.element
              )

              if (!editor.plugins.has('MyCustomUploadAdapterPlugin')) {
                editor.plugins.get(
                  'FileRepository'
                ).createUploadAdapter = loader => {
                  return new MyUploadAdapter(loader, handleUpload)
                }
              }
            } else {
              console.log(
                'Editor UI not ready or toolbarContainerRef not available.'
              )
            }
          }}
        />
      </Spin>
    </Fragment>
  )
}

export default CKEditorComponent
