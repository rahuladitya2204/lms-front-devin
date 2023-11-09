import { AutoComplete, Form, Input, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';

interface InputTagsProps {
  ctaText?: string;
  name: string;
  options?: string[];
}

const InputTags: React.FC<InputTagsProps> = ({ ctaText, name, options = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const inpRef = useRef(null);
  const form = Form.useFormInstance();

  const handleClose = (removedTag: string, remove: (index: number) => void) => {
    const tags = form.getFieldValue(name);
    const newTags = tags.filter((tag: string) => tag !== removedTag);
    form.setFieldsValue({ [name]: newTags });
    // This assumes that tags are unique, which might not be the case in all scenarios
    const indexToRemove = tags.indexOf(removedTag);
    if (indexToRemove !== -1) {
      remove(indexToRemove);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const filtered = options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
    setFilteredOptions(filtered);
  };

  const handleInputConfirm = (add: (value: string) => void) => {
    if (inputValue && form.getFieldValue(name).indexOf(inputValue) === -1) {
      add(inputValue);
      setInputVisible(false);
      setInputValue('');
    }
  };

  const handleSelect = (selectedValue: string, add: (value: string) => void) => {
    if (form.getFieldValue(name).indexOf(selectedValue) === -1) {
      add(selectedValue);
      setInputValue('');
    }
  };

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        const fieldValue = form.getFieldValue(name);
        console.log(fieldValue,'fieldValue')
        return (
          <>
            {fields.map((field, index) => (
              <Tag
                key={field.key}
                closable
                onClose={() => handleClose(fieldValue[index], remove)}
              >
                {fieldValue[index]}
              </Tag>
            ))}
            {inputVisible && (
              <AutoComplete
                options={filteredOptions.map(option => ({ value: option }))}
                value={inputValue}
                onSelect={(value: string) => handleSelect(value, add)}
                onSearch={handleInputChange}
                onBlur={() => setInputVisible(false)}
                style={{ width: 200 }}
              >
                <Input
                  ref={inpRef}
                  size="small"
                  onPressEnter={() => handleInputConfirm(add)}
                  style={{ width: 200 }}
                />
              </AutoComplete>
            )}
            {!inputVisible && (
              <Tag
                onClick={() => {
                  setInputVisible(true);
                  // @ts-ignore
                  setTimeout(() => inpRef.current?.focus(), 0);
                }}
                style={{ background: '#fff', borderStyle: 'dashed' }}
              >
                <PlusOutlined /> {ctaText || 'New Tag'}
              </Tag>
            )}
          </>
        )
      }}
    </Form.List>
  );
};

export default InputTags;