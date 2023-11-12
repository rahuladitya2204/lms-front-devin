import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
import 'katex/dist/katex.min.css'
import './style.css'

import {
  AdvancedEditorOptions,
  BasicEditorOptions,
  IntermediateEditorOptions
} from './constant'
import { Common, Types } from '@adewaskar/lms-common'
import { Form, Spin } from 'antd'
import React, { Fragment, useRef } from 'react'

import SunEditor from 'suneditor-react'
import katex from 'katex'
import { uniqueId } from 'lodash'
import { variablePlugin } from './plugins/variable.plugin'

interface SunEditorPropsI {
  height?: number;
  width?: number;
  name?: string | string[];
  variables?: Types.Variable[];
  value?: string;
  mode?: string;
  readonly?: boolean;
  onChange?: (d: string) => void;
  defaultValue?: string;
  level?: 1 | 2 | 3; // 1 = Minimal, 2 = Medium, 3 = High
}

const SunEditorComponent = (props: SunEditorPropsI) => {
  const level = props.level || 2
  const form = Form.useFormInstance()
  const editorRef = useRef()
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()

  // @ts-ignore
  const getSunEditorInstance = sunEditor => {
    editorRef.current = sunEditor
  }

  let value = Form.useWatch(props.name + '', form)
  if (props.value) {
    value = props.value
  }

  // Decide which options to use based on the level prop
  let options: any = BasicEditorOptions
  if (level === 2) {
    options = IntermediateEditorOptions
  } else if (level === 3) {
    options = AdvancedEditorOptions
  }

  const handleImageUploadBefore = (files: any, info: any) => {
    const editorInstance = editorRef.current
    if (level === 3) {
      const file = files[0]
      if (file instanceof File) {
        // Change the file name by appending a unique identifier (timestamp or unique ID)
        const uniqueSuffix = `-${Date.now()}-${uniqueId()}`
        const newFileName = `${file.name.split('.')[0]}${
          uniqueSuffix
        }.${file.name.split('.').pop()}`
        const newFile = new File([file], newFileName, { type: file.type })

        // Insert a temporary image element with a loading image source
        uploadFiles({
          files: [{ file: newFile, prefixKey: uniqueId() }],
          isProtected: false,
          onUploadProgress: e => {
            // console.log(e, 'e')
          },
          onSuccess: ([uploadFile]) => {
            const id = uniqueId()
            console.log(editorInstance, uploadFile, 'kokokok')
            const imageHtml = `<img id=${id} data-id="${
              id
            }" data-type="userUpload" src="${uploadFile.url}" alt="Image" />`
            // @ts-ignore
            editorInstance.insertHTML(imageHtml)
          }
        })

        // Cancel the default image uploading behavior
        return false
      } else {
        console.log('The provided object is not a File')
        return false
      }
    } else {
      console.log('Image upload is not allowed for this level')
      return false
    }
  }
  return (
    <Fragment>
      <Spin spinning={loading}>
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          // onFocus={props.onFocus}
          readOnly={props.readonly}
          setContents={value}
          onChange={e => {
            if (props.name) {
              form.setFieldValue(props.name, e)
            }
            props.onChange && props.onChange(e)
          }}
          height={`${props.height || 700}`}
          width={`${props.width}`}
          setOptions={{
            ...options
            // plugins={defaultPlugins}
            // plugins: [variablePlugin(variables)],
            // attributesWhitelist: {
            //   // span: 'variable-value'
            // }
          }}
          // @ts-ignore
          onImageUploadBefore={handleImageUploadBefore}
        />
      </Spin>
    </Fragment>
  )
}

export default SunEditorComponent
