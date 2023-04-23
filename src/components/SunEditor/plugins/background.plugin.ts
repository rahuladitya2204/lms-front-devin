// @ts-nocheck
import 'suneditor/dist/css/suneditor.min.css'

import React, { useEffect } from 'react'

import SunEditor from 'suneditor-react'

export const setBackgroundImagePlugin = {
  name: 'setBackgroundImage',
  display: 'button',
  buttonClass: '',
  add: function (core) {
    const context = core.context
    context.custom = {
      fileInput: '',
      customButton: ''
    }

    context.custom.fileInput = document.createElement('input')
    context.custom.fileInput.type = 'file'
    context.custom.fileInput.accept = 'image/*'
    context.custom.fileInput.style.display = 'none'
    context.custom.fileInput.addEventListener('change', event => {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.onload = e => {
        const imageUrl = e.target.result
        core.context.element.wysiwyg.style.backgroundImage = `url(${imageUrl})`
      }

      if (file) {
        reader.readAsDataURL(file)
      }
    })

    context.custom.customButton = document.createElement('button')
    context.custom.customButton.innerHTML = 'Set Background Image'
  },
  init: function (core) {
    const context = core.context
    const toolbar = core.context.element.toolbar
    this.buttonClass = core.util.addClass(context.custom.customButton, 'se-btn')

    context.custom.customButton.addEventListener('click', () => {
      this.action()
    })

    toolbar
      .querySelector('.se-btn-group:last-child')
      .appendChild(context.custom.customButton)
  },
  action: function () {
    this.core.context.custom.fileInput.click()
  },
  active: function () {
    return false
  },
  after: function (core) {
    core.context.custom.fileInput.remove()
  }
}

export function useSunEditorPlugin (editorInstance, plugin) {
  useEffect(
    () => {
      if (editorInstance && plugin) {
        const context = editorInstance.core.context
        console.log(context, 'editorInstance')

        plugin.add(editorInstance.core)
        if (context.toolbar) {
          context.toolbar.appendChild(context.custom.customButton)
        }
      }
    },
    [editorInstance, plugin]
  )
}
