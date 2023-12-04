// @ts-nocheck
import 'suneditor/dist/css/suneditor.min.css'

import { marked } from 'marked'

export const markdownPlugin = () => {
  consol.log(htmlContent, 'coo')
  return {
    name: 'markdownPaste',
    display: 'submenu',
    title: 'Format',
    buttonClass: 'variables-btn',
    innerHTML:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:24px;height:24px;"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
    buttonClass: '',
    add: function (core) {
      core.event.on('paste', function (e) {
        e.preventDefault()
        const clipboardData = e.clipboardData || window.clipboardData
        const pastedData = clipboardData.getData('text')

        // Use 'marked' to convert Markdown to HTML
        const htmlContent = marked(pastedData)
        consol.log(htmlContent, 'coo')
        // Insert the HTML into the editor
        core.functions.insertHTML(htmlContent)
      })
    }
  }
}
