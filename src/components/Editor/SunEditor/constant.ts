import katex from 'katex'
import TikzPlugin from './plugins/tikz-plugin'
import math from 'suneditor/src/plugins/dialog/math';
import ImgToTikzPlugin from './plugins/img-to-tikz';

export const BasicEditorOptions = {
  // plugins: [markdownPlugin],
  buttonList: [
    // ['markdownPaste'],
    ['undo', 'redo'],
    ['bold', 'underline', 'italic', 'strike'],
    ['fontColor', 'hiliteColor'],
    ['removeFormat']
  ]
}

export const IntermediateEditorOptions = {
  katex: katex,
  // plugins: [markdownPlugin],
  buttonList: [
    // ['markdownPaste'],
    ['undo', 'redo'],
    ['font', 'fontSize', 'formatBlock'],
    ['math'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor', 'textStyle'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['-right', ':r-More Rich-default.more_plus', 'table'],
    ['-right', 'link']
  ]
}

export const AdvancedEditorOptions = editor => {
  return {
    katex: katex,
    plugins: [TikzPlugin(editor), ImgToTikzPlugin(editor), math],
    buttonList: [
      ['imgToTikz'],
      ['tikzDialog'],
      // ['audioUpload'],
      // ['markdownPaste'],
      // ['backgroundPlugin'],
      // ['variablePlugin'],
      // default
      ['undo', 'redo'],
      [
        //   ':p-More Paragraph-default.more_paragraph',
        'font',
        'fontSize',
        'formatBlock',
        'paragraphStyle',
        'blockquote'
      ],
      ['math'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      [
        '-right',
        ':i-More Misc-default.more_vertical',
        'fullScreen',
        'showBlocks',
        'codeView',
        'preview',
        'print',
        'save',
        'template'
      ],
      ['-right', ':r-More Rich-default.more_plus', 'table'],
      ['-right', 'image', 'video', 'audio', 'link'],
      // (min-width: 992)
      [
        '%992',
        [
          ['undo', 'redo'],
          [
            ':p-More Paragraph-default.more_paragraph',
            'font',
            'fontSize',
            'formatBlock',
            'paragraphStyle',
            'blockquote'
          ],
          ['bold', 'underline', 'italic', 'strike'],
          [
            ':t-More Text-default.more_text',
            'subscript',
            'superscript',
            'fontColor',
            'hiliteColor',
            'textStyle'
          ],
          ['removeFormat'],
          ['outdent', 'indent'],
          ['align', 'horizontalRule', 'list', 'lineHeight'],
          // [
          //   '-right',
          //   ':i-More Misc-default.more_vertical',
          //   'fullScreen',
          //   'showBlocks',
          //   'codeView',
          //   'preview',
          //   'print',
          //   'save',
          //   'template'
          // ],
          [
            '-right',
            ':r-More Rich-default.more_plus',
            'table',
            'link',
            'image',
            'video',
            'audio',
            // 'audioUpload',
            'math'
          ]
        ]
      ],
      // (min-width: 767)
      [
        '%767',
        [
          ['undo', 'redo'],
          [
            ':p-More Paragraph-default.more_paragraph',
            'font',
            'fontSize',
            'formatBlock',
            'paragraphStyle',
            'blockquote'
          ],
          [
            ':t-More Text-default.more_text',
            'bold',
            'underline',
            'italic',
            'strike',
            'subscript',
            'superscript',
            'fontColor',
            'hiliteColor',
            'textStyle'
          ],
          ['removeFormat'],
          ['outdent', 'indent'],
          [
            ':e-More Line-default.more_horizontal',
            'align',
            'horizontalRule',
            'list',
            'lineHeight'
          ],
          [
            ':r-More Rich-default.more_plus',
            'table',
            'link',
            'image',
            'video',
            'audio',
            'math'
          ],
          [
            '-right',
            ':i-More Misc-default.more_vertical',
            'fullScreen',
            'showBlocks',
            'codeView',
            'preview',
            'print',
            'save',
            'template'
          ]
        ]
      ],
      // (min-width: 480)
      [
        '%480',
        [
          ['undo', 'redo'],
          [
            ':p-More Paragraph-default.more_paragraph',
            'font',
            'fontSize',
            'formatBlock',
            'paragraphStyle',
            'blockquote'
          ],
          [
            ':t-More Text-default.more_text',
            'bold',
            'underline',
            'italic',
            'strike',
            'subscript',
            'superscript',
            'fontColor',
            'hiliteColor',
            'textStyle',
            'removeFormat'
          ],
          [
            ':e-More Line-default.more_horizontal',
            'outdent',
            'indent',
            'align',
            'horizontalRule',
            'list',
            'lineHeight'
          ],
          [
            ':r-More Rich-default.more_plus',
            'table',
            'link',
            'image',
            'video',
            'audio',
            'math'
          ],
          [
            '-right',
            ':i-More Misc-default.more_vertical',
            'fullScreen',
            'showBlocks',
            'codeView',
            'preview',
            'print',
            'save',
            'template'
          ]
        ]
      ]
    ]
  }
}

export const TEST_TEMPLATES = [
  {
    label: 'GPSC Class-3 CCE Yuva Upanishad',
    value: 'gpscyuva',
    template: {
      sections: [
        {
          title: 'રિઝનિંગ',
          itemCount: 40,
          optionCount: 4,
          score: { correct: 1, incorrect: -0.25 },
          questionType: 'single'
        },
        {
          title: 'ગણિત',
          itemCount: 30,
          optionCount: 4,
          score: { correct: 1, incorrect: -0.25 },
          questionType: 'single'
        },
        {
          title: 'English',
          itemCount: 15,
          optionCount: 4,
          score: { correct: 1, incorrect: -0.25 },
          questionType: 'single'
        },
        {
          title: 'ગુજરાતી',
          itemCount: 15,
          optionCount: 4,
          score: { correct: 1, incorrect: -0.25 },
          questionType: 'single'
        }
      ]
    }
  },
  {
    label: 'UPSC Prelims Full Length',
    value: 'upscprelims',
    template: {
      sections: [
        {
          title: 'Section-1',
          itemCount: 100,
          optionCount: 4,
          score: { correct: 2, incorrect: -0.67 },
          questionType: 'single'
        }
      ]
    }
  },
  {
    label: 'UPSC Mains Essay',
    value: 'upscmains-essay',
    template: {
      sections: [
        {
          title: 'Section-1',
          itemCount: 2,
          wordLimit: 1200,
          score: { correct: 125, incorrect: 0 },
          questionType: 'subjective'
        }
      ]
    }
  },
  {
    label: 'UPSC Mains Non Essay',
    value: 'upscmains-nonessay',
    template: {
      sections: [
        {
          title: 'Section-1',
          itemCount: 20,
          wordLimit: 150,
          score: { correct: 12.5, incorrect: 0 },
          questionType: 'subjective'
        }
      ]
    }
  }
]
