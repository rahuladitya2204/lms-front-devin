// @ts-nocheck

import '../quill.css'

// @ts-nocheck
import { Quill } from 'react-quill'

// app.js
class CustomImageBlot extends Quill.import('formats/image') {
  static create (value) {
    const node = super.create(value)
    node.style = 'width:100%;'
    return node
  }
}

Quill.register({
  'formats/image': CustomImageBlot
})

