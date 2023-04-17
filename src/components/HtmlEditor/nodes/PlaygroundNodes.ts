/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {AutoLinkNode, LinkNode} from '@lexical/link';
import {CodeHighlightNode, CodeNode} from '@lexical/code';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import type {Klass, LexicalNode} from 'lexical';
import {ListItemNode, ListNode} from '@lexical/list';
import {TableCellNode, TableNode, TableRowNode} from '@lexical/table';

import {AutocompleteNode} from './AutocompleteNode';
import {CollapsibleContainerNode} from '../plugins/CollapsiblePlugin/CollapsibleContainerNode';
import {CollapsibleContentNode} from '../plugins/CollapsiblePlugin/CollapsibleContentNode';
import {CollapsibleTitleNode} from '../plugins/CollapsiblePlugin/CollapsibleTitleNode';
import {EmojiNode} from './EmojiNode';
// import {EquationNode} from './EquationNode';
import {FigmaNode} from './FigmaNode';
import {HashtagNode} from '@lexical/hashtag';
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';
import {ImageNode} from './ImageNode';
import {KeywordNode} from './KeywordNode';
import {MarkNode} from '@lexical/mark';
import {MentionNode} from './MentionNode';
import {TableNode as NewTableNode} from './TableNode';
import {OverflowNode} from '@lexical/overflow';
import {PollNode} from './PollNode';
import {StickyNode} from './StickyNode';
import {TweetNode} from './TweetNode';
import {YouTubeNode} from './YouTubeNode';

const PlaygroundNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  NewTableNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  PollNode,
  StickyNode,
  ImageNode,
  MentionNode,
  EmojiNode,
  // EquationNode,
  AutocompleteNode,
  KeywordNode,
  HorizontalRuleNode,
  TweetNode,
  YouTubeNode,
  FigmaNode,
  MarkNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
];

export default PlaygroundNodes;
