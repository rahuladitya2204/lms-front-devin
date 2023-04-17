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
  blockCursor: 'editor_blockCursor',
  characterLimit: 'editor_characterLimit',
  code: 'editor_code',
  codeHighlight: {
    atrule: 'editor_tokenAttr',
    attr: 'editor_tokenAttr',
    boolean: 'editor_tokenProperty',
    builtin: 'editor_tokenSelector',
    cdata: 'editor_tokenComment',
    char: 'editor_tokenSelector',
    class: 'editor_tokenFunction',
    'class-name': 'editor_tokenFunction',
    comment: 'editor_tokenComment',
    constant: 'editor_tokenProperty',
    deleted: 'editor_tokenProperty',
    doctype: 'editor_tokenComment',
    entity: 'editor_tokenOperator',
    function: 'editor_tokenFunction',
    important: 'editor_tokenVariable',
    inserted: 'editor_tokenSelector',
    keyword: 'editor_tokenAttr',
    namespace: 'editor_tokenVariable',
    number: 'editor_tokenProperty',
    operator: 'editor_tokenOperator',
    prolog: 'editor_tokenComment',
    property: 'editor_tokenProperty',
    punctuation: 'editor_tokenPunctuation',
    regex: 'editor_tokenVariable',
    selector: 'editor_tokenSelector',
    string: 'editor_tokenSelector',
    symbol: 'editor_tokenProperty',
    tag: 'editor_tokenProperty',
    url: 'editor_tokenOperator',
    variable: 'editor_tokenVariable',
  },
  embedBlock: {
    base: 'editor_embedBlock',
    focus: 'editor_embedBlockFocus',
  },
  hashtag: 'editor_hashtag',
  heading: {
    h1: 'editor_h1',
    h2: 'editor_h2',
    h3: 'editor_h3',
    h4: 'editor_h4',
    h5: 'editor_h5',
    h6: 'editor_h6',
  },
  image: 'editor-image',
  indent: 'editor_indent',
  link: 'editor_link',
  list: {
    listitem: 'editor_listItem',
    listitemChecked: 'editor_listItemChecked',
    listitemUnchecked: 'editor_listItemUnchecked',
    nested: {
      listitem: 'editor_nestedListItem',
    },
    olDepth: [
      'editor_ol1',
      'editor_ol2',
      'editor_ol3',
      'editor_ol4',
      'editor_ol5',
    ],
    ul: 'editor_ul',
  },
  ltr: 'editor_ltr',
  mark: 'editor_mark',
  markOverlap: 'editor_markOverlap',
  paragraph: 'editor_paragraph',
  quote: 'editor_quote',
  rtl: 'editor_rtl',
  table: 'editor_table',
  tableAddColumns: 'editor_tableAddColumns',
  tableAddRows: 'editor_tableAddRows',
  tableCell: 'editor_tableCell',
  tableCellActionButton: 'editor_tableCellActionButton',
  tableCellActionButtonContainer:
    'editor_tableCellActionButtonContainer',
  tableCellEditing: 'editor_tableCellEditing',
  tableCellHeader: 'editor_tableCellHeader',
  tableCellPrimarySelected: 'editor_tableCellPrimarySelected',
  tableCellResizer: 'editor_tableCellResizer',
  tableCellSelected: 'editor_tableCellSelected',
  tableCellSortedIndicator: 'editor_tableCellSortedIndicator',
  tableResizeRuler: 'editor_tableCellResizeRuler',
  tableSelected: 'editor_tableSelected',
  text: {
    bold: 'editor_textBold',
    code: 'editor_textCode',
    italic: 'editor_textItalic',
    strikethrough: 'editor_textStrikethrough',
    subscript: 'editor_textSubscript',
    superscript: 'editor_textSuperscript',
    underline: 'editor_textUnderline',
    underlineStrikethrough: 'editor_textUnderlineStrikethrough',
  },
};

export default theme;
