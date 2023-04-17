// @ts-nocheck
import './styles.css'

import { AutoLinkNode, LinkNode } from '@lexical/link'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'

import { $generateHtmlFromNodes } from '@lexical/html'
import { $getRoot } from 'lexical'
import { $getSelection } from 'lexical'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import ExampleTheme from './themes/ExampleTheme'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
// import ImagesPlugin from './plugins/ImagePlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import MentionsPlugin from './plugins/MentionsPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TRANSFORMERS } from '@lexical/markdown'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import TreeViewPlugin from './plugins/TreeViewPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useRef } from 'react'

function Placeholder () {
  return <div className="editor-placeholder">Enter some rich text...</div>
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError (error) {
    throw error
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode
    // ImageNode
  ]
}

export default function Editor (props) {
  // console.log(editor, 'editor')
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangeComponent onChange={props.onChange} />

          <HistoryPlugin />
          <TreeViewPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <MentionsPlugin />

          {/* <ImagesPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  )
}

function OnChangeComponent ({ onChange }) {
  const [editor] = useLexicalComposerContext()
  function onEditorChange (editorState) {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null)
      console.log(htmlString, 'eddi')
      onChange(htmlString)
    })
  }

  return <OnChangePlugin onChange={onEditorChange} />
}
