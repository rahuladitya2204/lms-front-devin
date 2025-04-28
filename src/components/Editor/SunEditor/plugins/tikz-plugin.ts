// TikzContainerPlugin.js
import axios from 'axios';

const TikzContainerPlugin = (editorInstance) => {
  return {
    name: 'tikzDialog',
    display: 'dialog',  // Tells SunEditor to treat it as a “dialog” plugin

    add(core, targetElement) {
      core.addButtonIcon('tikzDialog', `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      `);
      // Build the dialog markup, passing the REAL editor instance
      const container = this._makeContainer(core, editorInstance);
      container.editorInstance = editorInstance
      // Register as a “dialog” plugin, not a “container” plugin
      core.initMenuTarget(this.name, targetElement, container, 'dialog');

      // Must store { container } in context so the built-in overlay logic can find it
      core.context.tikzDialog = { container };
    },

    // Called automatically when user clicks the “tikzDialog” toolbar button
    open() {
      const container = this.context.tikzDialog.container;
      if (container) {
        // Show the custom modal
        container.querySelector('.se-tikz-modal').style.display = 'block';
      }
    },

    // Build your custom markup, passing the real editor instance
    _makeContainer(core, editor, ...args) {
      console.log(core, editor, args, '1232112121')
      // Make a <div> for the .se-dialog-content
      const container = core.util.createElement('DIV');

      // Provide your HTML & inline CSS
      container.innerHTML = `
        <style>
          .se-tikz-modal {
            display: none;
            position: fixed;
            top: 150px; left: 50%;
            transform: translateX(-50%);
            width: 500px;
            background: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            border-radius: 4px;
            z-index: 999999;
            font-family: sans-serif;
          }

          .se-tikz-header {
            background: #f5f5f5;
            padding: 12px 16px;
            border-bottom: 1px solid #ccc;
            font-size: 16px;
            font-weight: bold;
          }

          .se-tikz-body {
            padding: 16px;
          }

          .se-tikz-body label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
          }

          .se-tikz-body textarea {
            width: 100%;
            height: 120px;
            padding: 8px;
            box-sizing: border-box;
            resize: vertical;
            margin-bottom: 12px;
            font-family: monospace;
          }

          .se-tikz-preview {
            min-height: 80px;
            border: 1px solid #ccc;
            padding: 5px;
            background: #fafafa;
          }

          .se-tikz-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 8px 16px;
            border-top: 1px solid #ccc;
          }
          .se-tikz-footer button {
            margin-left: 8px;
          }
        </style>

        <div class="se-tikz-modal">
          <div class="se-tikz-header">Insert TikZ</div>
          <div class="se-tikz-body">
            <div>
              <label for="tikz_input">TikZ Code:</label>
              <textarea id="tikz_input"
                        placeholder="\\begin{tikzpicture} ... \\end{tikzpicture}"></textarea>
            </div>
            <div style="margin-bottom:12px;">
              <label>Preview:</label>
              <div class="se-tikz-preview"></div>
            </div>
          </div>
          <div class="se-tikz-footer">
            <button type="button" class="se-btn se-btn-primary se-tikz-preview-btn">Preview</button>
            <button type="button" class="se-btn se-btn-primary se-tikz-submit-btn">Submit</button>
            <button type="button" class="se-btn se-btn-secondary se-tikz-close-btn">Close</button>
          </div>
        </div>
      `;

      console.log(editor, '22222'); // We can now see the real editor instance

      // Grab references to the controls
      const modalBox = container.querySelector('.se-tikz-modal');
      const textarea = container.querySelector('#tikz_input');
      const previewDiv = container.querySelector('.se-tikz-preview');
      const previewBtn = container.querySelector('.se-tikz-preview-btn');
      const submitBtn = container.querySelector('.se-tikz-submit-btn');
      const closeBtn = container.querySelector('.se-tikz-close-btn');
      let previewImg;
      // “Preview”
      previewBtn.addEventListener('click', async () => {
        const code = textarea.value.trim();
        if (!code) {
          previewDiv.innerHTML = '<em style="color:red;">Please enter TikZ code.</em>';
          return;
        }
        try {
          previewDiv.innerHTML = 'Rendering...';
          const resp = await axios.post('https://testmintai-back.azurewebsites.net/generative/tikz-to-img', { code });
          previewDiv.innerHTML = resp.data.svg || '<em>No SVG returned.</em>';
          previewImg = previewDiv.innerHTML;
        } catch (err) {
          previewDiv.innerHTML = `<em style="color:red;">Error: ${err.message}</em>`;
        }
      });

      // “Submit”
      submitBtn.addEventListener('click', () => {
        const code = textarea.value.trim();
        core.focus();
        if (!previewImg) return;

        const svgDataUrl = svgToBase64(previewImg); // Convert SVG to base64 data URL
        const imgTag = `<span class="tikz-img" data-code="${code}"><img class="tikz-img" src="${svgDataUrl}" alt="TikZ SVG" /></span>`;

        core.functions.insertHTML(imgTag);

        // Close & reset
        modalBox.style.display = 'none';
        textarea.value = '';
        previewDiv.innerHTML = '';
      });


      // “Close”
      closeBtn.addEventListener('click', () => {
        modalBox.style.display = 'none';
        textarea.value = '';
        previewDiv.innerHTML = '';
      });

      return container;
    }
  };
};

export default TikzContainerPlugin;

function svgToBase64(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  const header = "data:image/svg+xml;charset=utf-8,";
  return header + encoded;
}
