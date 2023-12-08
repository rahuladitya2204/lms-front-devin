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
import React, { Fragment, useEffect, useRef, useState } from 'react'

import SunEditor from 'suneditor-react'
import { uniqueId } from 'lodash'

interface SunEditorPropsI {
  height?: number;
  width?: number;
  name?: string | string[];
  variables?: Types.Variable[];
  uploadPrefixKey?: string;
  value?: string;
  mode?: string;
  readonly?: boolean; imageBase64?: boolean;
  onChange?: (d: string) => void;
  defaultValue?: string;
  level?: 1 | 2 | 3; // 1 = Minimal, 2 = Medium, 3 = High
}

const SunEditorComponent = (props: SunEditorPropsI) => {
  const level = props.level || 2
  const form = Form.useFormInstance()
  const editorRef = useRef<any | null>()
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()


  let value = Form.useWatch(props.name + '', form)
  if (props.value) {
    value = props.value
  }

  const [editorContent, setEditorContent] = useState<string | undefined>(props.value);

  useEffect(() => {
    if (props.value !== editorContent && editorRef.current) {
      editorRef.current.setContents(props.value || '');
    }
  }, [props.value, editorContent]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    if (props.name) {
      form.setFieldValue(props.name, content);
    }
    if (props.onChange) {
      props.onChange(content);
    }
  };
  // Decide which options to use based on the level prop
  let options: any = BasicEditorOptions
  if (level === 2) {
    options = IntermediateEditorOptions
  } else if (level === 3) {
    options = AdvancedEditorOptions
  }

  const handleImageUploadBefore = (files: any, info: any) => {
    const editorInstance = editorRef.current
    const file = files[0]
    if (level === 3) {
      if (props.imageBase64) {
        const reader = new FileReader();
        reader.onload = function (e) {
          // @ts-ignore
          const base64Image = e.target.result;
          const id = uniqueId();
          const imageHtml = `<img id="${id}" data-id="${id}" data-type="userUpload" src="${base64Image}" alt="Image" />`;
          editorInstance.insertHTML(imageHtml);
        };
    
        reader.onerror = function(error) {
          console.error('Error occurred while reading file:', error);
        };
    
      }
      else {
        if (file instanceof File) {
        // Insert a temporary image element with a loading image source
        uploadFiles({
          files: [{ file: file, prefixKey: props.uploadPrefixKey }],
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
          getSunEditorInstance={editor => editorRef.current = editor}
          // onFocus={props.onFocus}
          readOnly={props.readonly}
          setContents={value}
          onChange={handleEditorChange}
          height={`${props.height || 700}`}
          width={`${props.width}`}
          setOptions={{
            ...options,
          }}
          // @ts-ignore
          onImageUploadBefore={handleImageUploadBefore}
        />
      </Spin>
    </Fragment>
  )
}

export default SunEditorComponent
