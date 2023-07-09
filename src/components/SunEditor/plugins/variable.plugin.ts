// @ts-nocheck
import 'suneditor/dist/css/suneditor.min.css'

import { Types } from '@adewaskar/lms-common'

export const variablePlugin = (
  variables: { name: string, value: string }[]
) => {
  return {
    name: 'variablePlugin',
    display: 'submenu',
    title: 'Select Variables',
    buttonClass: 'variables-btn',
    innerHTML:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:24px;height:24px;"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
    buttonClass: '',
    // arguments - (core : core object, targetElement : clicked button element)
    add: function(core, targetElement) {
      // @Required
      // Registering a namespace for caching as a plugin name in the context object
      const context = core.context
      context.customSubmenu = {
        targetButton: targetElement,
        textElement: null,
        currentSpan: null
      }

      // Generate submenu HTML
      // Always bind "core" when calling a plugin function
      let listDiv = this.setSubmenu(core)

      // Input tag caching
      context.customSubmenu.textElement = listDiv.querySelector('input')
      // console.log(listDiv, variables, 'lili')
      listDiv
        .querySelector('.se-form-group')
        ?.addEventListener('click', this.onClick.bind(core))
      // You must bind "core" object when registering an event.
      /** add event listeners */
      // listDiv
      //   .querySelector('.se-btn-primary')
      //   .addEventListener('click', this.onClick.bind(core))
      // listDiv
      //   .querySelector('.se-btn')
      //   .addEventListener('click', this.onClickRemove.bind(core))

      // @Required
      // You must add the "submenu" element using the "core.initMenuTarget" method.
      /** append target button menu */
      core.initMenuTarget(this.name, targetElement, listDiv)
    },

    setSubmenu: function(core) {
      const listDiv = core.util.createElement('DIV')
      // @Required
      // A "se-submenu" class is required for the top level element.
      listDiv.className = 'se-menu-container se-submenu se-list-layer'
      listDiv.innerHTML =
        '' +
        '<div class="se-list-inner">' +
        '<ul class="se-list-basic" style="width: 230px;">' +
        '<li>' +
        '<div class="se-form-group">' +
        `
      <ul>
      ${variables
        .map(
          v => `<li class="variable-li">
      <span variable-value="${v.value}">${v.name}</span>
      </li>`
        )
        .join('')}
      </ul>  
      ` +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</div>'

      return listDiv
    },
    onClick: function(e) {
      const variable: Types.Variable = {
        name: e.target.innerHTML,
        value: e.target.getAttribute('variable-value')
      }
      // if (span) {
      //   span.textContent = value
      //   this.setRange(span, 1, span, 1)
      // } else {
      this.functions.insertHTML(
        `<span class="se-variable value=[${variable.value}]">${
          variable.name
        }</span>&#8203;`,
        // '<span class="se-custom-tag" variable-value="">' + variable.name + '</span>',
        true
      )
      this.submenuOff()
    }
  }
}
