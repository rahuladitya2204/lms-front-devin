import './styles.css'

import { $getRoot, $getSelection } from 'lexical';
import {Fragment, useCallback, useEffect, useRef, useState} from 'react';

import { $generateHtmlFromNodes } from '@lexical/html'
import { $generateNodesFromDOM } from '@lexical/html'
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import {CAN_USE_DOM} from './shared/canUseDOM';
import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
import {ClearEditorPlugin} from '@lexical/react/LexicalClearEditorPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import ContentEditable from './ui/ContentEditable';
import DragDropPaste from './plugins/DragDropPastePlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import FigmaPlugin from './plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import { Form } from 'antd';
import {HashtagPlugin} from '@lexical/react/LexicalHashtagPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import MentionsPlugin from './plugins/MentionsPlugin';
import {TablePlugin as NewTablePlugin} from './plugins/TablePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import Placeholder from './ui/Placeholder';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PollPlugin from './plugins/PollPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellNodes from './nodes/TableCellNodes';
import TableCellResizer from './plugins/TableCellResizer';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import TwitterPlugin from './plugins/TwitterPlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {useSharedHistoryContext} from './context/SharedHistoryContext';
import { useWatch } from 'antd/es/form/Form';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface Variable {
  name: string;
  value: string;
}
interface EditorPropsI{
  onChange?: Function;
  variables?: Variable[];
  name: string;
  // defaultValue?:any
  }

 function Editor({onChange,name,variables}:EditorPropsI): JSX.Element {
  const {historyState} = useSharedHistoryContext();
   const text = 'Enter some rich text...';
  const placeholder = <Placeholder>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: 'Playground',
    nodes: [...TableCellNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };

    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);
   
   const form = Form.useFormInstance();
   
   // start
   const [editor] = useLexicalComposerContext();
   const isFirstRender = useRef(true)
 
   const addVariable = (variable:any) => {
     const tag = `<span class="${variable.value}">${variable.name}</span>`;
     renderHtml(tag);
   }
 
   const renderHtml = (html:string) => {
     editor.update(() => {
         // In the browser you can use the native DOMParser API to parse the HTML string.
         const parser = new DOMParser()
         const dom = parser.parseFromString(html, `text/html`)
         // console.log(dom, 'dom')
         // Once you have the DOM instance it's easy to generate LexicalNodes.
         const nodes = $generateNodesFromDOM(editor, dom)
         // Select the root
         $getRoot().select()
 
         // Insert them at a selection.
         const selection:any = $getSelection()
         selection.insertNodes(nodes)
     })
   }

   const defaultValue = useWatch(name, form);
   console.log(defaultValue, '111');
   useEffect(
     () => {
      //  console.log(defaultValue, isFirstRender.current, 'defaultValue');
      if ((defaultValue) && (defaultValue !=='<p class="editor-paragraph"><br></p>') && (isFirstRender.current)) {
        // console.log(defaultValue,'defaultValue')
        isFirstRender.current = false;
        renderHtml(defaultValue);
       }

     }, [defaultValue]);
 
   const onEditorChange = useCallback(
     (editorState: any) => {
         editorState.read(() => {
           const htmlString = $generateHtmlFromNodes(editor, null)
          //  onChange && onChange(htmlString)
           form.setFieldsValue({ [name]: htmlString });
         })
     },
     [editor]
   )
 
 

   //end 

  return   <Fragment>
  <ToolbarPlugin />
      <div className={`editor-container tree-view`}>
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ComponentPickerPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />
        <MentionsPlugin variables={variables} />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
          <>
                      <HistoryPlugin externalHistoryState={historyState} />

            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin />
            <TableCellResizer />
            <NewTablePlugin cellEditorConfig={cellEditorConfig}>
              <AutoFocusPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="TableNode__contentEditable" />
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <MentionsPlugin />
              <HistoryPlugin />
              <ImagesPlugin captionsEnabled={false} />
              <LinkPlugin />
              <ClickableLinkPlugin />
              <FloatingTextFormatToolbarPlugin />
            </NewTablePlugin>
            <ImagesPlugin />
            <LinkPlugin />
            <PollPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <FigmaPlugin />
            <ClickableLinkPlugin />
            <HorizontalRulePlugin />

            <TabFocusPlugin />
            <TabIndentationPlugin />
            <CollapsiblePlugin />
            {floatingAnchorElem && !isSmallWidthViewport && (
              <>
                {/* <DraggableBlockPlugin anchorElem={floatingAnchorElem} /> */}
                {/* <CodeActionMenuPlugin anchorElem={floatingAnchorElem} /> */}
                <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                />
              </>
            )}
          </>
      <TreeViewPlugin />
      <OnChangePlugin onChange={onEditorChange} />
      </div>
    </Fragment>
  }

const initialConfig = {
  nodes: [...PlaygroundNodes],
  namespace: 'Playground',
  onError: (error: Error) => {
    throw error;
  },
  theme: PlaygroundEditorTheme,
};

export default function (props:any) {
  return <LexicalComposer initialConfig={initialConfig}>
    <Editor {...props} />
</LexicalComposer>
}