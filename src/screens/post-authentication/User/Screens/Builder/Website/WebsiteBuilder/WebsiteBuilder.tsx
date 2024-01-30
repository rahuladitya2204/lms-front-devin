// @ts-nocheck
import 'grapesjs/dist/css/grapes.min.css'

import { Button, Spin } from 'antd'
import { Common, User } from '@adewaskar/lms-common'
import React, { useEffect, useRef, useState } from 'react'

import Header from '@Components/Header'
import { SaveOutlined } from '@ant-design/icons'
import grapesjs from 'grapesjs'
import grapesjsPresetWebpage from 'grapesjs-preset-webpage'
import pluginBlocksBasic from 'grapesjs-blocks-basic'
import { useParams } from 'react-router'

const WebsiteBuilderScreen = () => {
  const { pageId } = useParams()
  const editorRef = useRef()
  const [loading, setLoading] = useState(false)
  const { mutate: uploadFiles } = Common.Queries.useUploadFiles()
  const { data: resetPage } = User.Queries.useGetResetWebsitePage()
  const { data: { code: { html, css, js } } } = User.Queries.useGetWebsitePage(
    pageId + ''
  )
  const { mutate: updateWebpage } = User.Queries.useUpdateWebsitePage()

  useEffect(
    () => {
      if (!editorRef.current) return

      const editor = grapesjs.init({
        container: editorRef.current,
        height: '1000px',
        fromElement: true,
        storageManager: false,
        plugins: [pluginBlocksBasic, grapesjsPresetWebpage],
        assetManager: {
          // Configure asset manager
          multiUpload: false, // For uploading a single file at a time
          uploadFile: function(e) {
            const file = e.target.files[0]
            if (file instanceof File) {
              // console.log(file, 'file')
              // setLoading(true)
              // Insert a temporary image element with a loading image source
              uploadFiles({
                files: [{ file: file, prefixKey: `website-asset/${Date.now()}` }],
                isProtected: false,
                onUploadProgress: e => {
                  // console.log(e, 'e')
                },
                onSuccess: ([uploadedFile]) => {
                  if (editor && uploadedFile && uploadedFile.url) {
                    console.log('File uploaded:', uploadedFile)
                    // editor.AssetManager
                    // After the upload, add the uploaded image to the asset manager
                    editor.AssetManager.add(uploadedFile.url)
                  } else {
                    console.error(
                      'Undefined object detected. Please check your upload response.'
                    )
                  }
                  // setLoading(false)
                }
              })

              // Cancel the default image uploading behavior
              return false
            } else {
              console.log('The provided object is not a File')
              return false
            }

            // Prevent the default upload
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            return false
          }
        }
      })

      editor.on('asset:upload:start', () => {
        startAnimation()
      })

      // The upload is ended (completed or not)
      editor.on('asset:upload:end', () => {
        endAnimation()
      })

      // Error handling
      editor.on('asset:upload:error', err => {
        notifyError(err)
      })

      if (html) editor.setComponents(html)
      if (css) editor.setStyle(css)
      if (js) addScriptComponent(js, editor)

      return () => editor.destroy()
    },
    [html, css, js]
  )

  const addScriptComponent = (scriptContent, editor) => {
    const scriptComponent = editor.getWrapper().find('script')[0]
    scriptComponent
      ? scriptComponent.set('content', scriptContent)
      : editor
          .getWrapper()
          .append({ tagName: 'script', content: scriptContent })
  }

  const saveWebpage = () => {
    const editor = getEditor()
    const outputHtml = editor.getHtml()
    const outputCss = editor.getCss()
    const outputJs =
      editor
        .getWrapper()
        .find('script')[0]
        ?.get('content') || ''

    updateWebpage({
      id: pageId,
      data: { code: { html: outputHtml, css: outputCss, js: outputJs } }
    })

    console.log('HTML:', outputHtml)
    console.log('CSS:', outputCss)
    console.log('JS:', outputJs)
  }

  const resetWebpage = () => {
    const { html: resetHtml, css: resetCss, js: resetJs } = resetPage
    const editor = getEditor()

    editor.setComponents(resetHtml)
    editor.setStyle(resetCss)
    resetJs && addScriptComponent(resetJs, editor)
  }

  const getEditor = () =>
    grapesjs.editors.find(e => e.getConfig().container === editorRef.current)

  return (
    <Header
      title="Website Builder"
      extra={[
        <Button onClick={resetWebpage}>Reset</Button>,
        <Button onClick={saveWebpage} type="primary" icon={<SaveOutlined />}>
          Save
        </Button>
      ]}
    >
      <div>{loading ? <Spin /> : <div ref={editorRef} />}</div>
    </Header>
  )
}

export default WebsiteBuilderScreen
