// @ts-nocheck
// VariablePlugin.ts
export interface Variable {
  name: string;
  value: string;
}

export const VariablePlugin = (variables: Variable[]) => {
  let editorContext = null
  let dropdown = null

  return {
    name: 'variable',
    display: 'command',
    add: function(core, targetElement) {
      console.log(core, 'popo')
      editorContext = core

      const context = core.context
      context.variable = {
        targetButton: targetElement
      }

      dropdown = document.createElement('div')
      dropdown.style.position = 'absolute'
      dropdown.style.display = 'none'
      dropdown.style.backgroundColor = '#fff'
      dropdown.style.border = '1px solid #ccc'
      dropdown.style.zIndex = '10'
      document.body.appendChild(dropdown)

      variables.forEach(variable => {
        const item = document.createElement('div')
        item.textContent = variable.name
        item.style.padding = '5px'
        item.style.cursor = 'pointer'
        item.onclick = () => {
          this.insertVariable(variable)
          this.hideDropdown()
        }
        dropdown.appendChild(item)
      })

      targetElement.addEventListener('click', function() {
        // Show dropdown or perform other actions when the button is clicked
        // Optional: You can remove this if you don't need a button in the toolbar
      })

      core.context.element.wysiwyg.addEventListener('keyup', e => {
        if (e.key === '@') {
          const rect = core
            .getSelection()
            .getRangeAt(0)
            .getBoundingClientRect()
          this.showDropdown(rect.left, rect.bottom)
        } else if (e.key === 'Escape') {
          this.hideDropdown()
        }
      })
    },
    showDropdown: function(x, y) {
      dropdown.style.left = `${x}px`
      dropdown.style.top = `${y}px`
      dropdown.style.display = 'block'
    },
    hideDropdown: function() {
      dropdown.style.display = 'none'
    },
    insertVariable: function(variable) {
      editorContext.core.insertHTML(
        `<span class="variable" contenteditable="false" style="background-color:yellow;">${
          variable.name
        }</span>&nbsp;`
      )
    }
  }
}
