// ImgToTikzPlugin.js
import axios from 'axios';
import { stringToBase64 } from '../utils';

const ImgToTikzPlugin = (editorInstance) => {
  return {
    name: 'imgToTikz',
    display: 'dialog', // Tells SunEditor to treat it as a “dialog” plugin

    add(core, targetElement) {
      // 1) Build the dialog markup
      const container = this._makeContainer(core, editorInstance);
      container.editorInstance = editorInstance;

      // 2) Register as a “dialog” plugin
      core.initMenuTarget(this.name, targetElement, container, 'dialog');

      // 3) Store { container } so the built-in overlay logic can find it
      core.context.imgToTikz = { container };
    },

    // Called automatically when user clicks the “imgToTikz” toolbar button
    open() {
      const container = this.context.imgToTikz.container;
      if (container) {
        container.querySelector('.se-tikz-modal').style.display = 'block';
      }
    },

    _makeContainer(core, editor) {
      // Create a <div> to hold the dialog content
      const container = core.util.createElement('DIV');

      // Larger width & improved styling for better previews
      container.innerHTML = `
        <style>
          .se-tikz-modal {
            display: none;
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 800px; /* Increase width for a bigger preview area */
            background: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            border-radius: 4px;
            z-index: 999999;
            font-family: sans-serif;
            max-height: 90vh; /* Ensures the dialog doesn't overflow screen */
            overflow-y: auto; /* Allow vertical scroll if content is tall */
          }

          .se-tikz-header {
            background: #f5f5f5;
            padding: 12px 16px;
            border-bottom: 1px solid #ccc;
            font-size: 16px;
            font-weight: bold;
            position: sticky;
            top: 0;
            z-index: 1;
          }

          .se-tikz-body {
            padding: 16px;
          }

          .se-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap; /* So if it's smaller screen, it adjusts */
          }

          .se-row label {
            min-width: 80px;
          }

          .se-row input {
            flex: 1;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .se-tikz-preview-row {
            display: flex;
            gap: 16px;
            justify-content: space-between;
            margin-bottom: 16px;
            flex-wrap: wrap; 
          }

          .se-preview-side {
            flex: 1 1 300px; /* Each side at least 300px wide */
            border: 1px solid #ccc;
            background: #fafafa;
            min-height: 250px; /* Larger vertical space */
            padding: 8px;
            text-align: center;
            overflow: auto; /* In case the content is large */
          }
          .se-preview-side h4 {
            margin-bottom: 8px;
          }

          .se-preview-side img {
            max-width: 100%;
            max-height: 220px;
            display: block;
            margin: 0 auto;
          }

          .se-converted-preview svg {
            max-width: 100%;
            max-height: 220px;
          }

          .se-tikz-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 8px 16px;
            border-top: 1px solid #ccc;
            position: sticky;
            bottom: 0;
            background: #fff;
            z-index: 1;
          }

          .se-tikz-footer button {
            margin-left: 8px;
          }
        </style>

        <div class="se-tikz-modal">
          <div class="se-tikz-header">Convert Image to TikZ</div>
          <div class="se-tikz-body">
            <!-- Row with URL input + two buttons: Preview & Convert -->
            <div class="se-row">
              <label>Image URL:</label>
              <input type="text" id="image_url_input" placeholder="https://example.com/image.png" />
              <button type="button" class="se-btn se-btn-secondary se-preview-btn">Preview</button>
              <button type="button" class="se-btn se-btn-primary se-convert-btn">Convert</button>
            </div>

            <!-- Previews row: left for original, right for converted -->
            <div class="se-tikz-preview-row">
              <div class="se-preview-side">
                <h4>Original Image</h4>
                <img class="se-original-img" alt="No image" />
              </div>
              <div class="se-preview-side">
                <h4>Converted TikZ</h4>
                <div class="se-converted-preview"></div>
              </div>
            </div>
          </div>
          <div class="se-tikz-footer">
            <button type="button" class="se-btn se-btn-primary se-tikz-submit-btn">Submit</button>
            <button type="button" class="se-btn se-btn-secondary se-tikz-close-btn">Close</button>
          </div>
        </div>
      `;

      // Grab references to elements
      const modalBox = container.querySelector('.se-tikz-modal');
      const imageUrlInput = container.querySelector('#image_url_input');
      const previewBtn = container.querySelector('.se-preview-btn');
      const convertBtn = container.querySelector('.se-convert-btn');
      const originalImgEl = container.querySelector('.se-original-img');
      const convertedPreview = container.querySelector('.se-converted-preview');
      const submitBtn = container.querySelector('.se-tikz-submit-btn');
      const closeBtn = container.querySelector('.se-tikz-close-btn');

      let convertedSvg = '';
      let convertedCode = '';

      // (A) “Preview” → Show the original image on the left side
      previewBtn.addEventListener('click', () => {
        const url = imageUrlInput.value.trim();
        if (!url) {
          alert('Please enter a valid image URL first.');
          return;
        }
        originalImgEl.src = url;
      });

      // (B) “Convert” → Call server to get TikZ-based SVG, show on right side
      convertBtn.addEventListener('click', async () => {
        const url = imageUrlInput.value.trim();
        if (!url) {
          alert('Please enter a valid image URL first.');
          return;
        }
        // Clear any previous conversion result
        convertedPreview.innerHTML = 'Converting...';
        convertedSvg = '';
        convertedCode = '';

        try {
          // Example: calling your backend that converts images to TikZ
          // (Adjust the endpoint & response structure as needed)
          const resp = await axios.post('http://localhost:4000/generative/img-to-tikz', {
            imageUrl: url,
          });

          if (resp.data) {
            convertedSvg = resp.data.svg;
            convertedCode = stringToBase64(resp.data.code);
            console.log(convertedCode, 'convertedCode')
            convertedPreview.innerHTML = `<span data-tikz="${convertedCode}">${convertedSvg}</span>`;
          } else {
            convertedPreview.innerHTML = '<em>No SVG returned.</em>';
          }
        } catch (err) {
          console.error('Conversion error:', err);
          convertedPreview.innerHTML = `<em style="color:red;">Error: ${err.message}</em>`;
        }
      });

      // (C) “Submit” → Insert the converted TikZ as an <img> (encoded SVG) into the editor
      submitBtn.addEventListener('click', () => {
        if (!convertedSvg) {
          alert('No converted SVG to insert. Please “Convert” first.');
          return;
        }

        // Focus the editor before inserting
        core.focus();

        // Convert the <svg> string to a base64 data URL
        const svgDataUrl = svgToBase64(convertedSvg);
        const imgTag = `<span data-tikz="${convertedCode}"><img src="${svgDataUrl}" alt="${convertedCode}" /></span>`;

        // Insert the new image into the SunEditor content
        core.functions.insertHTML(imgTag);

        // Close & reset
        modalBox.style.display = 'none';
        imageUrlInput.value = '';
        originalImgEl.src = '';
        convertedPreview.innerHTML = '';
        convertedSvg = '';
        convertedCode = '';
      });

      // (D) “Close”
      closeBtn.addEventListener('click', () => {
        modalBox.style.display = 'none';
        imageUrlInput.value = '';
        originalImgEl.src = '';
        convertedPreview.innerHTML = '';
        convertedSvg = '';
        convertedCode = '';
      });

      return container;
    }
  };
};

export default ImgToTikzPlugin;

/**
 * Convert an SVG string to a base64 data URL.
 * This allows embedding the returned SVG directly as an <img src="data:image/svg+xml...">
 */
function svgToBase64(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  const header = "data:image/svg+xml;charset=utf-8,";
  return header + encoded;
}
