import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
import './style.css'

import { Common, Types } from '@adewaskar/lms-common'
import { Form, Spin } from 'antd'
import React, { Fragment } from 'react'

import SunEditor from 'suneditor-react'
import { editorOptions } from './constant'
import { variablePlugin } from './plugins/variable.plugin'

interface SunEditorPropsI {
  height?: number;
  width?: number;
  name?: string | string[];
  variables?: Types.Variable[];
  value?: string;
  onChange?: (d: string) => void;
  defaultValue?: string;
}

const SunEditorComponent = (props: SunEditorPropsI) => {
  const form = Form.useFormInstance()
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  let value = Form.useWatch(props.name + '', form)
  if (props.value) {
    value = props.value
  }
  // console.log(value, 'va');
  const handleImageUploadBefore = (
    files: any,
    info: any,
    editorInstance: any
  ) => {
    const file = files[0]
    if (file instanceof File) {
      // Insert a temporary image element with a loading image source
      uploadFiles({
        files: [{ file: file, prefixKey: 'jjijijij' }],
        isProtected: false,
        onUploadProgress: e => {
          // console.log(e, 'e')
        },
        onSuccess: ([uploadFile]) => {
          console.log(uploadFile, 'kokokok')
          const loadingImageUrl = uploadFile.url
          const imageElement = editorInstance.util.createElement('IMG')
          imageElement.src = loadingImageUrl
          editorInstance.insertNode(imageElement)
        }
      })

      // Cancel the default image uploading behavior
      return false
    } else {
      console.log('The provided object is not a File')
      return false
    }
  }
  const variables = [
    { name: 'Course Name', value: 'course.title' },
    { name: 'Learner Name', value: 'learner.name' }
  ]
  return (
    <Fragment>
      <Spin spinning={loading}>
        <SunEditor
          // defaultValue={value}
          // name={props.name}
          setContents={value}
          onChange={e => {
            // console.log(e, 'ee');
            if (props.name) {
              // const html = document.querySelector('.sun-editor-editable')
              //   ?.innerHTML
              // console.log(html, 'html')
              form.setFieldValue(props.name, e)
            }
            props.onChange && props.onChange(e)
          }}
          height={`${props.height || 700}`}
          width={`${props.width}`}
          setOptions={{
            ...editorOptions,
            plugins: [variablePlugin(variables)],
            attributesWhitelist: {
              // span: 'variable-value'
            }
          }}
          // @ts-ignore
          onImageUploadBefore={handleImageUploadBefore}
        />
      </Spin>
    </Fragment>
  )
}
export default SunEditorComponent
