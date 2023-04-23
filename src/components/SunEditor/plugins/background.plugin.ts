// @ts-nocheck
import 'suneditor/dist/css/suneditor.min.css'

import { Types } from '@adewaskar/lms-common'

export const backgroundPlugin = () => {
  return {
    name: 'backgroundPlugin',
    display: 'container',
    title: 'Set Background Image',
    buttonClass: 'background-image-btn',
    innerHTML: '<span>Set Background</span>',
    add: function (core, targetElement) {
      const context = core.context
      context.custom = {
        targetButton: targetElement
      }

      // Create file input element
      const fileInput = core.util.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.style.display = 'none'

      // Append file input to editor
      context.element.wysiwygFrame.parentNode.appendChild(fileInput)

      // Add event listener to open file dialog when button is clicked
      targetElement.addEventListener('click', () => {
        fileInput.click()
      })

      // Add event listener to handle file input change
      fileInput.addEventListener('change', e => {
        if (e.target.files.length === 0) return

        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onload = event => {
          const backgroundImage = `url(${event.target.result})`
          core.context.element.wysiwyg.style.backgroundImage = backgroundImage
        //   core.context.element.wysiwyg.innerHTML = `<div style="background-image: ${
        //     backgroundImage
        //   };">${core.context.element.wysiwyg.innerHTML}</div>`
        }

        reader.readAsDataURL(file)
      })
    }
  }
}
