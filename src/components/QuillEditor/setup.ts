// @ts-nocheck
import { ImageResize } from 'quill-image-resize-module-ts'
import { Quill } from 'react-quill'
import { QuillToolbarDropDown } from './config'

var BackgroundClass = Quill.import('attributors/class/background')
var ColorClass = Quill.import('attributors/class/color')
var SizeStyle = Quill.import('attributors/style/size')
Quill.register(BackgroundClass, true)
Quill.register(ColorClass, true)
Quill.register(SizeStyle, true)

Quill.register('modules/imageResize', ImageResize)

var Embed = Quill.import('blots/embed')

class TemplateMarker extends Embed {
  static create ({ name, value }) {
    console.log(name, value, typeof value, 'aaa')
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

export const createVariablesButton = (quill, variables) => {
  const dropDownItems = {}
  variables.forEach(varEl => {
    dropDownItems[varEl.name] = varEl.value
  })
  //   const dropDownItems = {
  //     'Course Name': 'course.name',
  //     'Learner Name': 'learner.name',
  //     'Learner Address': 'learner.address'
  //   }

  const myDropDown = new QuillToolbarDropDown({
    label: 'Variables',
    rememberSelection: true
  })

  myDropDown.setItems(dropDownItems)

  myDropDown.onSelect = function (label, value, quill) {
    const varEl = variables.find(v => v.value === value)
    addVariable(quill, varEl)
    // Do whatever you want with the new dropdown selection here

    // // For example, insert the value of the dropdown selection:
    // const { index, length } = quill.selection.savedRange
    // quill.deleteText(index, length)
    // quill.insertText(index, value)
    // quill.setSelection(index + value.length)
  }
  myDropDown.attach(quill)
}

const addVariable = (quill, variable) => {
  let range = quill.getSelection(true)

  quill.insertEmbed(
    range.index,
    // Insert the TemplateMarker in the same range as the cursor is

    'TemplateMarker',
    // This is the name of the Embed

    //   {
    // colour: `warning`,
    // marker:`first_name`,
    // title: `FIRST NAME`
    // }
    variable
    // These are the variable values to feed to the editor
  )

  quill.insertText(range.index + 1, ' ', Quill.sources.USER)
  // Add a space after the marker

  quill.setSelection(range.index + 2, Quill.sources.SILENT)
}

function selectLocalImage (quill, uploadFiles) {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.click()

  // Listen upload local image and save to server
  input.onchange = () => {
    const file = input.files[0]
    console.log(file, 'file')
    // file type is only image.
    if (/^image\//.test(file.type)) {
      uploadFiles({
        files: [{ file: file, prefixKey: 'jjijijij' }],
        isProtected: false,
        onUploadProgress: e => {
          // console.log(e, 'e')
        },
        onSuccess: ([uploadFile]) => {
          const range = quill.getSelection()
          quill.insertEmbed(range.index, 'image', `${uploadFile.url}`, {
            width: '100%'
          })
        }
      })
    } else {
      console.warn('You could only upload images.')
    }
  }
}

export const addImageUpload = (quill, uploadFiles) => {
  quill.getModule('toolbar').addHandler('image', () => {
    selectLocalImage(quill, uploadFiles)
  })
}
