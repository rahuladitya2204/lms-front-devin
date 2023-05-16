import { Form, Input, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import type { InputRef } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface InputTagsPropsI{
  values?: string[];
  name?: string;
  onChange?: (e: any) => void;
}

const InputTags: React.FC<InputTagsPropsI> = (props) => {
  const [tags, setTags] = useState<string[]>(props.values || []);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
    onChange(newTags)
  };

  useEffect(() => { 
    if (props.values) {
      setTags(props.values);
    }
  }, [props.values]);

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onChange = (value:string[]) => {
    props.onChange && props.onChange(value);
    // form.setFieldValue({
    //   [props.name]: value
    // });
  }

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
    setInputVisible(false);
    setInputValue('');
    onChange(newTags)
  }
};



  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);
  return (
    <>
      <Space align='start' wrap>
          {tagChild}    <span>{inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag color='volcano' onClick={showInput} className="site-tag-plus">
          <PlusOutlined /> New Tag
        </Tag>
      )}</span>
     
     </Space>
    </>
  );
};

export default InputTags;