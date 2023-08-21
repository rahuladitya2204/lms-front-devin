import { AutoComplete, Form, Input, Tag } from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import React from 'react';

interface InputTagsPropsI {
  ctaText?: string;
  name: string | string[];
  values?: string[];
}

const InputTags: React.FC<InputTagsPropsI> = ({ ctaText, values = [],name }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [inputVisible, setInputVisible] = React.useState(false);
  
  const form = Form.useFormInstance();
  const tags: string[] = form.getFieldValue(name) || [];

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    form.setFieldValue(name, newTags);
  };

  const handleInputChange = (e: any) => {
    setInputValue(e);
  };

  const handleInputConfirm = () => {
    let newTags = [...tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    form.setFieldValue(name, newTags);
    setInputVisible(false);
    setInputValue('');
  };

  const handleSelect = (selectedValue: string) => {
    if (tags.indexOf(selectedValue) === -1) {
      const newTags = [...tags, selectedValue];
      form.setFieldValue(name, newTags);
      setInputValue('');
    }
  };

  return (
    <>
      {tags.map((tag, index) => (
        <Tag key={tag} closable={true} onClose={() => handleClose(tag)}>
          {tag}
        </Tag>
      ))}
      {inputVisible && (
        <AutoComplete
          style={{ width: 200 }}
          options={values.map(value => ({ value }))}
          value={inputValue}
          onSelect={handleSelect}
          onSearch={handleInputChange}
          onBlur={() => setInputVisible(false)}
        >
          <Input
            type="text"
            size="small"
            onPressEnter={handleInputConfirm}
            style={{ width: 200 }}
          />
        </AutoComplete>
      )}
      {!inputVisible && (
        <Tag onClick={() => setInputVisible(true)} style={{ background: '#fff', borderStyle: 'dashed' }}>
          <PlusOutlined /> {ctaText ? ctaText : 'New Tag'}
        </Tag>
      )}
    </>
  );
};

export default InputTags;
