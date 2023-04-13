// @ts-nocheck
import { ImageResize } from 'quill-image-resize-module-ts'
import { Quill } from 'react-quill'
import { QuillToolbarDropDown } from './config'

class CustomButtonBlot extends Quill.Embed {
    static create(value) {
      const node = super.create(value);
      node.setAttribute('href', value.href || '#');
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
      node.innerHTML = value.name || '';
      node.style.backgroundColor = value.color || 'transparent';
      node.addEventListener('click', () => {
        const button = document.querySelector('.ql-customButton');
        const picker = document.querySelector('.color-picker');
        const colorInput = picker.querySelector('.color-picker-input');
        const linkInput = picker.querySelector('.link-input');
        const insertButton = picker.querySelector('.insert-button');
        const bounds = button.getBoundingClientRect();
        picker.style.display = 'block';
        picker.style.left = `${bounds.left + window.pageXOffset}px`;
        picker.style.top = `${bounds.top + window.pageYOffset + bounds.height}px`;
        colorInput.value = node.style.backgroundColor;
        linkInput.value = node.getAttribute('href');
        insertButton.addEventListener('click', () => {
          node.style.backgroundColor = colorInput.value;
          node.setAttribute('href', linkInput.value);
          picker.style.display = 'none';
        });
      });
      return node;
    }
    
    // ...
  
}