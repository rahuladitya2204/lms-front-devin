/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  LexicalTypeaheadMenuPlugin,
  QueryMatch,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {$createMentionNode} from '../../nodes/MentionNode';
import {TextNode} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const CapitalizedNameMentionsRegex = new RegExp(
  '(^|[^#])((?:' + DocumentMentionsRegex.NAME + '{' + 1 + ',})$)',
);

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const mentionsCache = new Map();

const VARIALBES = [
  {
    name: 'learner name',
    value: 'learner.name'
  }
];

const dummyLookupService = (variables:Variable[]) => {
  return {
    search(string: string, callback: (results: Array<{name:string,value:string}>) => void): void {
      setTimeout(() => {
        const results = variables.filter((mention) =>
          mention.name.toLowerCase().includes(string.toLowerCase()),
        );
        callback(results);
      }, 500);
    },
  }
};

interface Variable {
  name: string;
  value: string;
}

function useMentionLookupService(mentionString: string | null,variables:Variable[]) {
  const [results, setResults] = useState<Array<{name:string,value:string}>>([]);

  useEffect(() => {
    const cachedResults = mentionsCache.get(mentionString);

    if (mentionString == null) {
      setResults([]);
      return;
    }

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    dummyLookupService(variables)?.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults);
      setResults(newResults);
    });
  }, [mentionString]);

  return results;
}

function checkForCapitalizedNameMentions(
  text: string,
  minMatchLength: number,
): QueryMatch | null {
  const match = CapitalizedNameMentionsRegex.exec(text);
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[2];
    if (matchingString != null && matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: matchingString,
      };
    }
  }
  return null;
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): QueryMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): QueryMatch | null {
  const match = checkForAtSignMentions(text, 1);
  return match === null ? checkForCapitalizedNameMentions(text, 3) : match;
}

class MentionTypeaheadOption extends TypeaheadOption {
  name: string;
  picture: JSX.Element;
  value: string;

  constructor(name: string,value:string, picture: JSX.Element) {
    super(name);
    this.name = name;
    this.value=value
    this.picture = picture;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}>
      {option.picture}
      <span className="text">{option.name}</span>
    </li>
  );
}

interface NewMentionsPluginPropsI {
  variables?: { name: string, value: string }[];
}

export default function NewMentionsPlugin(props:NewMentionsPluginPropsI): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const variables = props.variables || [];
  const [queryString, setQueryString] = useState<string | null>(null);

  const results = useMentionLookupService(queryString,variables);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results
        .map(
          (result) =>
            new MentionTypeaheadOption(result.name,result.value, <i className="icon user" />),
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        console.log(selectedOption,'selectedOption')
        const mentionNode = $createMentionNode(selectedOption.name,selectedOption.value);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        {selectedIndex, selectOptionAndCleanUp, setHighlightedIndex},
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="typeahead-popover mentions-menu">
                <ul>
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
