import { AutoComplete, Col, Form, Input, Row, Tag } from 'antd';
import React, { useRef, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Typography } from '@Components/Typography';

const { Text } = Typography;

interface LabelItem { label: string, id?: string }
interface InputTagsProps {
  ctaText?: string;
  name: string | string[];
  label?: string;
  onChange?: (tags: string[]) => void; // New callback prop
  options?: LabelItem[];
}

const InputTags: React.FC<InputTagsProps> = ({ ctaText, name, options = [],onChange,label }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<LabelItem[]>(options);
  const inpRef = useRef(null);
  const form = Form.useFormInstance();

  const handleClose = (removedTag: string, remove: (index: number) => void) => {
    const tags = form.getFieldValue(name);
    const newTags = tags.filter((tag: string) => tag !== removedTag);
    form.setFieldValue(name,newTags);
    if (onChange) {
      onChange(newTags);
    }
    // This assumes that tags are unique, which might not be the case in all scenarios
    const indexToRemove = tags.indexOf(removedTag);
    if (indexToRemove !== -1) {
      remove(indexToRemove);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const filtered = options.filter(option => option.label.toLowerCase().includes(value.toLowerCase()));
    setFilteredOptions(filtered);
  };

  const handleInputConfirm = (add: (value: LabelItem) => void) => {
    
    const item = options.find(o => o.label === inputValue) || { label: inputValue };
    if (inputValue && form.getFieldValue(name).indexOf(inputValue) === -1) {
      add(item);
      setInputVisible(false);
      setInputValue('');
      if (onChange) {
        const updatedTags = form.getFieldValue(name);
        onChange(updatedTags);
      }
    }
  };

  const handleSelect = (id: string, add: (value: LabelItem) => void) => {
    const selectedValue = options.find(o => o.id === id) || { id: '', label: "" };
    console.log(selectedValue,'selectedValue')
    if (form.getFieldValue(name).indexOf(selectedValue) === -1) {
      add(selectedValue);
      setInputValue('');
      setTimeout(() => {
        if (onChange) {
          const updatedTags = form.getFieldValue(name);
          onChange(updatedTags);
        }
      }, 0);
    }
  };
  // console.log(options,'tops')
  return (
    <Row gutter={[0,10]}>
      {label?<Col span={24}>
        <Text>{ label}</Text>
      </Col>: null}
      <Col span={24}>
      <Form.List name={name}>
      {(fields, { add, remove }) => {
        const fieldValue = form.getFieldValue(name);
        // console.log(fieldValue,'fieldValue')
        return (
          <>
            {fields.map((field, index) => (
              <Tag
                key={field.key}
                closable
                onClose={() => handleClose(fieldValue[index], remove)}
              >
                {fieldValue[index].label}
              </Tag>
            ))}
            {inputVisible && (
              <AutoComplete
                options={filteredOptions.map(option => ({ value: option.id,label: option.label }))}
                value={inputValue}
                onSelect={(id: string) => handleSelect(id, add)}
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
      </Col>
    </Row>
  );
};

export default InputTags;