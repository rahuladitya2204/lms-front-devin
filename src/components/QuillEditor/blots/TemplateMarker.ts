// @ts-nocheck
import { ImageResize } from 'quill-image-resize-module-ts'
import { Quill } from 'react-quill'

Quill.register('modules/imageResize', ImageResize)

var Embed = Quill.import('blots/embed')

class TemplateMarker extends Embed {
  static create ({ name, value }) {
    let node = super.create(value)
    if (name && value !== null) {
      node.setAttribute('class', 'variable-tag')
      // Set up the (Bootstrap) badge, and badge colour

      node.setAttribute('variable-value', value)
      node.setAttribute('variable-name', name)
      // The marker is the (hidden) template marker reference
      // node.setAttribute('data-collection', collection)
      node.innerHTML = name
    }

    // The title is what the user sees in their editor

    return node
  }

  delta () {
    const ops = super.delta()
    const spanOps = ops.filter(op => {
      return (
        op.insert &&
        typeof op.insert === 'string' &&
        this.domNode === op.attributes['variable-value']
      )
    })
    return new Delta(spanOps)
  }

  format (name, value) {
    if (name === 'variable-value' && value) {
      const [span] = this.domNode.querySelectorAll(
        `span[variable-value="${value}"]`
      )
      if (span) {
        super.format(name, value)
      }
    } else {
      super.format(name, value)
    }
  }

  static value (node) {
    // console.log(node, 'nodee')
    // // console.log(
    // //   {
    // //     value: node.getAttribute('data-value'),
    // //     title: node.getAttribute('data-title'),
    // //     collection: node.getAttribute('data-collection')
    // //   },
    // //   'ooooooo'
    // // )
    return {
      value: node.getAttribute('variable-value'),
      name: node.innerText
      //   collection: node.getAttribute('data-collection')
    }
  }
}

TemplateMarker.blotName = 'TemplateMarker'
TemplateMarker.tagName = 'span'

Quill.register({
  'formats/TemplateMarker': TemplateMarker
})
