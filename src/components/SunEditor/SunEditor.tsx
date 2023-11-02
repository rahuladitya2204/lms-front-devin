import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
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
import { variablePlugin } from './plugins/variable.plugin'

export interface SunEditorPropsI {
  height?: number;
  width?: number;
  name?: string | string[];
  onFocus?: () => void;
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
    // Only allow image upload for level 3
    if (level === 3) {
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
            console.log(editorInstance, uploadFile, 'kokokok')
            const imageHtml = `<img src="${uploadFile.url}" alt="Image" />`
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

  // const variables = [
  //   { name: 'Course Name', value: 'course.title' },
  //   { name: 'Learner Name', value: 'learner.name' }
  // ]

  return (
    <Fragment>
      <Spin spinning={loading}>
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          onFocus={props.onFocus}
          readOnly={props.readonly}
          setContents={value}
          onChange={e => {
            if (props.name) {
              form.setFieldValue(props.name, e)
            }
            props.onChange && props.onChange(e)
          }}
          // @ts-ignore
          height={`${props.height || 700}`}
          // @ts-ignore
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
