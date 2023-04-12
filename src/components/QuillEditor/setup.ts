// @ts-nocheck
import { Quill } from 'react-quill';

var BackgroundClass = Quill.import('attributors/class/background')
var ColorClass = Quill.import('attributors/class/color')
var SizeStyle = Quill.import('attributors/style/size')
Quill.register(BackgroundClass, true)
Quill.register(ColorClass, true)
Quill.register(SizeStyle, true)

var Embed = Quill.import('blots/embed')

class TemplateMarker extends Embed {
  static create ({ name, value, collection }) {
    console.log(value, 'eeeee')
    let node = super.create(value)

    node.setAttribute('class', 'variable-tag')
    // Set up the (Bootstrap) badge, and badge colour

    node.setAttribute('data-value', value)
    // The marker is the (hidden) template marker reference
    node.setAttribute('data-collection', collection)

    node.innerHTML = name
    // The title is what the user sees in their editor

    return node
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
      value: node.getAttribute('data-value'),
      name: node.innerHTML,
      collection: node.getAttribute('data-collection')
    }
  }
}

TemplateMarker.blotName = 'TemplateMarker'
TemplateMarker.tagName = 'span'

Quill.register({
  'formats/TemplateMarker': TemplateMarker
})
