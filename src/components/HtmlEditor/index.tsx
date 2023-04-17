// @ts-nocheck
import './styles.css'

import { AutoLinkNode, LinkNode } from '@lexical/link'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { Form, Space, Tag } from 'antd'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { useCallback, useEffect, useRef } from 'react'

import { $generateHtmlFromNodes } from '@lexical/html'
import { $generateNodesFromDOM } from '@lexical/html'
import { $getRoot } from 'lexical'
import { $getSelection } from 'lexical'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import ExampleTheme from './themes/ExampleTheme'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ImageNode } from './nodes/ImageNode'
import ImagesPlugin from './plugins/ImagesPlugin'
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
import ToolbarPlugin from './plugins/ToolbarPlugin/index'
import TreeViewPlugin from './plugins/TreeViewPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

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
    LinkNode,
    ImageNode
  ]
}

export default function Editor (props) {
  // console.log(editor, 'editor')


  return (
    <Space direction="vertical">
      <LexicalComposer initialConfig={editorConfig}>
        <EditorComponent {...props} />
      </LexicalComposer>
    </Space>
  )
}

function EditorComponent({defaultValue,variables,onChange}) {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true)

  const addVariable = (variable) => {
    const tag = `<span class="${variable.value}">${variable.name}</span>`;
    renderHtml(tag);
  }

  const renderHtml = (html:string) => {
    editor.update(() => {
        isFirstRender.current = false
        // In the browser you can use the native DOMParser API to parse the HTML string.
        const parser = new DOMParser()
        const dom = parser.parseFromString(html, `text/html`)
        // console.log(dom, 'dom')
        // Once you have the DOM instance it's easy to generate LexicalNodes.
        const nodes = $generateNodesFromDOM(editor, dom)
        // Select the root
        $getRoot().select()

        // Insert them at a selection.
        const selection = $getSelection()
        selection.insertNodes(nodes)
    })
  }

  useEffect(
    () => {
      if (
        defaultValue &&
        defaultValue !== '<p class="editor-paragraph"><br></p>' &&
        isFirstRender.current
      ) {
        renderHtml(defaultValue);
      }
    }, [defaultValue]);

  const onEditorChange = useCallback(
    editorState => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null)
        console.log(htmlString, 'eddi')
        onChange(htmlString)
      })
    },
    [editor]
  )

  return (
    <>
      {variables ? (
        <Space style={{marginBottom:20}}>
          Variables:{' '}
          {variables.map(v => {
            return <Tag onClick={e => addVariable(v)}>{v.name}</Tag>
          })}
        </Space>
      ) : null}
      <div className="editor-container">
      <ToolbarPlugin />
      <div className="editor-inner">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
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
        <ImagesPlugin />

        <OnChangePlugin onChange={onEditorChange} />
      </div>
    </div></>
  
  )
}

function OnChangeComponent ({ onChange, defaultValue }) {


  return <OnChangePlugin onChange={onEditorChange} />
}
