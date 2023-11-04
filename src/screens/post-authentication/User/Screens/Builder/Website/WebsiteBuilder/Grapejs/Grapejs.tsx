// @ts-nocheck
import 'grapesjs/dist/css/grapes.min.css'

import React, { Fragment, useEffect, useRef } from 'react'

import { Button } from 'antd'
import { Common } from '@adewaskar/lms-common'
import Header from '@Components/Header'
import { SaveOutlined } from '@ant-design/icons'
import grapesjs from 'grapesjs'
import grapesjsPresetWebpage from 'grapesjs-preset-webpage'
import pluginBlocksBasic from 'grapesjs-blocks-basic'

// Make sure to install this package

// Make sure to install this dependency

// If you are using the webpage preset

function GrapesJSComponent({ html = '', css = '', js = '' }) {
  const editorRef = useRef()
  const {
    mutate: uploadFiles,
    isFetching: loading
  } = Common.Queries.useUploadFiles()

  useEffect(
    () => {
      const editor = grapesjs.init({
        container: editorRef.current,
        height: '1000px',
        fromElement: true,
        storageManager: false, // disable storage manager for the sake of this example
        plugins: [pluginBlocksBasic, grapesjsPresetWebpage],
        // initialize the editor with the given HTML, CSS, and JS
        components: html,
        style: css,
        assetManager: {
          // Add a custom upload function
          uploadFile(e) {
            const file = e.dataTransfer
              ? e.dataTransfer.files[0]
              : e.target.files[0]
            const formData = new FormData()
            formData.append('file', file)

            // Call your custom hook for file uploading
            uploadFiles({
              files: [{ file: file, prefixKey: 'website-asset' }],
              isProtected: false,
              onUploadProgress: e => {
                console.log(e)
              },
              onSuccess: ([uploadFile]) => {
                const loadingImageUrl = uploadFile.url
                // Create an image block and add it to the editor
                editor.DomComponents.addType('img', {
                  model: {
                    defaults: {
                      tagName: 'img',
                      attributes: { src: loadingImageUrl }
                      //   style: { width: '300px' } // Add default styles here
                    }
                  }
                })

                const blockManager = editor.BlockManager
                blockManager.add('imageBlock', {
                  label: 'Image Block',
                  attributes: { class: 'fa fa-image' },
                  category: 'Basic',
                  content: { type: 'img' }
                })

                // Add image component to canvas
                editor.setComponents({ type: 'img' })
              }
            })
          }
        }
      })

      if (js) {
        // If JS is provided, add it as a script component
        const scriptComponent = editor.getWrapper().find('script')[0]
        if (scriptComponent) {
          scriptComponent.set('content', js)
        } else {
          editor.getWrapper().append({ tagName: 'script', content: js })
        }
      }

      return () => editor.destroy()
    },
    [html, css, js]
  )

  const handleClick = () => {
    const editor = grapesjs.editors.find(
      e => e.getConfig().container === editorRef.current
    )

    const outputHtml = editor.getHtml()
    const outputCss = editor.getCss()
    // This assumes there is a script component present
    const outputJs =
      editor
        .getWrapper()
        .find('script')[0]
        ?.get('content') || ''

    console.log('HTML:', outputHtml)
    console.log('CSS:', outputCss)
    console.log('JS:', outputJs)
  }

  return (
    <Header
      title="Website Builder"
      extra={[
        <Fragment>
          <Button type="primary" icon={<SaveOutlined />}>
            Save
          </Button>
        </Fragment>
      ]}
    >
      <div>
        <div ref={editorRef} />
        <button onClick={handleClick}>Log Current HTML/CSS/JS</button>
      </div>
    </Header>
  )
}

export default GrapesJSComponent
