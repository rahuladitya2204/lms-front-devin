// @ts-nocheck
import './blots/TemplateMarker'
import './blots/Image'

import { Quill } from 'react-quill'
import { QuillToolbarDropDown } from './config'

// import './blots/CustomButton'


const ColorClass = Quill.import('attributors/class/color');
const BackgroundClass = Quill.import('attributors/class/background');
const ColorStyle = Quill.import('attributors/style/color');
const BackgroundStyle = Quill.import('attributors/style/background');

Quill.register(ColorClass, true);
Quill.register(BackgroundClass, true);
Quill.register(ColorStyle, true);
Quill.register(BackgroundStyle, true);

export const createVariablesButton = (quill, variables) => {
  const dropDownItems = {}
  variables.forEach(varEl => {
    dropDownItems[varEl.name] = varEl.value
  })

  const myDropDown = new QuillToolbarDropDown({
    label: 'Variables',
    rememberSelection: true
  })

  myDropDown.setItems(dropDownItems)

  myDropDown.onSelect = function (label, value, quill) {
    const varEl = variables.find(v => v.value === value);
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
