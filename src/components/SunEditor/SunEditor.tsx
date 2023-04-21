import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File

import { Form, Spin } from 'antd'
import React, { Fragment } from 'react'

import { Common } from '@adewaskar/lms-common'
import SunEditor from 'suneditor-react'
import { editorOptions } from './constant'
import plugins from 'suneditor/src/plugins'

interface SunEditorPropsI {
  height?: number;
  name?: string | string[];
  defaultValue?: string;
}

const SunEditorComponent = (props: SunEditorPropsI) => {
  const form = Form.useFormInstance()
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  const value = Form.useWatch(props.name + '', form)
  console.log(value, 'aaaaa')

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

  return (
    <Fragment>
      <Spin spinning={loading}>
        <SunEditor
          // name={props.name}
          setContents={value}
          onChange={e => props.name && form.setFieldValue(props.name, e)}
          height={`${props.height || 700}`}
          setOptions={{
            ...editorOptions
            //   plugins: Object.values(plugins)
          }}
          // @ts-ignore
          onImageUploadBefore={handleImageUploadBefore}
        />
      </Spin>
    </Fragment>
  )
}
export default SunEditorComponent
