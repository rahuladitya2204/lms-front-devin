// @ts-nocheck
export const customDropdownPlugin = {
  // @Required @Unique
  // plugin name
  name: 'customDropdown',

  // @Required
  // data display
  display: 'container',

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core, targetElement) {
    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const context = core.context
    context.custom_container = {}

    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu(core)

    // You must bind "core" object when registering an event.
    /** add event listeners */
    listDiv
      .querySelector('.se-form-group')
      .addEventListener('click', this.onClick.bind(core))

    // @Required
    // You must add the "submenu" element using the "core.initMenuTarget" method.
    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv)
  },

  setSubmenu: function (core) {
    const listDiv = core.util.createElement('DIV')
    const icons = core.icons // assets/defaultIcons.js
    listDiv.className = 'se-menu-container se-submenu se-list-layer'
    listDiv.innerHTML =
      '' +
      '<div class="se-list-inner">' +
      '<div class="se-form-group">' +
      // @Required
      // The "position" style of each element surrounding the button must be "relative".
      // suneditor.css: .sun-editor .se-form-group > div {position:relative;}
      '<div>' +
      // @Required
      // Enter the button name of the plug-in or default command in the button's "data-command"
      '<button type="button" class="se-btn se-tooltip" data-command="bold" style="margin: 0 !important;">' +
      `Course Name` +
      '<span class="se-tooltip-inner">' +
      '<span class="se-tooltip-text">Quote</span>' +
      '</span>' +
      '</button>' +
      '</div>' +
      '<div>' +
      '<button type="button" class="se-btn se-tooltip" data-command="blockquote">' +
      icons.blockquote +
      '<span class="se-tooltip-inner">' +
      '<span class="se-tooltip-text">Quote</span>' +
      '</span>' +
      '</button>' +
      '</div>' +
      '<div>' +
      '<button type="button" class="se-btn se-tooltip" data-command="link">' +
      icons.link +
      '<span class="se-tooltip-inner">' +
      '<span class="se-tooltip-text">Link</span>' +
      '</span>' +
      '</button>' +
      '</div>' +
      '<div>' +
      '<button type="button" class="se-btn se-tooltip" data-command="table">' +
      icons.table +
      '<span class="se-tooltip-inner">' +
      '<span class="se-tooltip-text">Table</span>' +
      '</span>' +
      '</button>' +
      '</div>' +
      '<div>' +
      '<button type="button" class="se-btn se-tooltip" data-command="textStyle">' +
      icons.text_style +
      '<span class="se-tooltip-inner">' +
      '<span class="se-tooltip-text">Text style</span>' +
      '</span>' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>'

    return listDiv
  },

  onClick: function (e) {
    e.preventDefault()
    e.stopPropagation()

    let target = e.target
    let command = ''

    while (!command && !/^UL$/i.test(target.tagName)) {
      command = target.getAttribute('data-command')
      if (command) break
      target = target.parentNode
    }

    if (!command) return

    const plugin = this.plugins[command]
    this.actionCall(command, plugin ? plugin.display : '', target)
  }
}

// suneditor.create('suneditor', {
//   plugins: [customDropdownPlugin],
//   buttonList: [['customDropdown']]
// })

// suneditor.create('suneditor', {
//   plugins: [customDropdownPlugin],
//   buttonList: [['customDropdown']]
// })
