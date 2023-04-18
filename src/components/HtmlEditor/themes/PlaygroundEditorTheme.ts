/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './PlaygroundEditorTheme.css';

import type {EditorThemeClasses} from 'lexical';

const theme: EditorThemeClasses = {
  blockCursor: 'editor-blockCursor',
  characterLimit: 'editor-characterLimit',
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
  embedBlock: {
    base: 'editor-embedBlock',
    focus: 'editor-embedBlockFocus',
  },
  hashtag: 'editor-hashtag',
  heading: {
    h1: 'editor-h1',
    h2: 'editor-h2',
    h3: 'editor-h3',
    h4: 'editor-h4',
    h5: 'editor-h5',
    h6: 'editor-h6',
  },
  image: 'editor-image',
  indent: 'editor-indent',
  link: 'editor-link',
  list: {
    listitem: 'editor-listItem',
    listitemChecked: 'editor-listItemChecked',
    listitemUnchecked: 'editor-listItemUnchecked',
    nested: {
      listitem: 'editor-nestedListItem',
    },
    olDepth: [
      'editor-ol1',
      'editor-ol2',
      'editor-ol3',
      'editor-ol4',
      'editor-ol5',
    ],
    ul: 'editor-ul',
  },
  ltr: 'editor-ltr',
  mark: 'editor-mark',
  markOverlap: 'editor-markOverlap',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  rtl: 'editor-rtl',
  table: 'editor-table',
  tableAddColumns: 'editor-tableAddColumns',
  tableAddRows: 'editor-tableAddRows',
  tableCell: 'editor-tableCell',
  tableCellActionButton: 'editor-tableCellActionButton',
  tableCellActionButtonContainer:
    'editor-tableCellActionButtonContainer',
  tableCellEditing: 'editor-tableCellEditing',
  tableCellHeader: 'editor-tableCellHeader',
  tableCellPrimarySelected: 'editor-tableCellPrimarySelected',
  tableCellResizer: 'editor-tableCellResizer',
  tableCellSelected: 'editor-tableCellSelected',
  tableCellSortedIndicator: 'editor-tableCellSortedIndicator',
  tableResizeRuler: 'editor-tableCellResizeRuler',
  tableSelected: 'editor-tableSelected',
  text: {
    bold: 'editor-textBold',
    code: 'editor-textCode',
    italic: 'editor-textItalic',
    strikethrough: 'editor-textStrikethrough',
    subscript: 'editor-textSubscript',
    superscript: 'editor-textSuperscript',
    underline: 'editor-textUnderline',
    underlineStrikethrough: 'editor-textUnderlineStrikethrough',
  },
};

export default theme;
