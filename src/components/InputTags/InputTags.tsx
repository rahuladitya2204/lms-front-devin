import { AutoComplete, Form, Input, Tag } from "antd";
import React, { useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

interface InputTagsProps {
  ctaText?: string;
  onChange?: (tags: string[]) => void;
  options?: string[];
  value?: string[];
}

const InputTags: React.FC<InputTagsProps> = ({
  ctaText,
  options = [],
  onChange,
  value = [],
}) => {
  const [inputValue, setInputValue] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const inpRef = useRef(null);

  const handleClose = (removedTag: string) => {
    const newTags = value.filter((tag) => tag !== removedTag);
    if (onChange) {
      onChange(newTags);
    }
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleInputConfirm = () => {
    if (inputValue && value.indexOf(inputValue) === -1) {
      const newTags = [...value, inputValue];
      if (onChange) {
        onChange(newTags);
      }
      setInputVisible(false);
      setInputValue("");
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (value.indexOf(selectedValue) === -1) {
      const newTags = [...value, selectedValue];
      if (onChange) {
        onChange(newTags);
      }
      setInputValue("");
    }
  };

  return (
    <>
      {value.map((tag) => (
        <Tag key={tag} closable onClose={() => handleClose(tag)}>
          {tag}
        </Tag>
      ))}
      {inputVisible && (
        <AutoComplete
          options={filteredOptions.map((option) => ({
            value: option,
          }))}
          value={inputValue}
          onSelect={handleSelect}
          onSearch={handleInputChange}
          onBlur={() => setInputVisible(false)}
          style={{ width: 200 }}
        >
          <Input
            ref={inpRef}
            size="small"
            onPressEnter={handleInputConfirm}
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
          style={{ background: "#fff", borderStyle: "dashed" }}
        >
          <PlusOutlined /> {ctaText || "New Tag"}
        </Tag>
      )}
    </>
  );
};

const InputTagsFormItem: React.FC<InputTagsProps> = (props) => {
  return (
    <Form.Item name={props.name} noStyle>
      <InputTags {...props} />
    </Form.Item>
  );
};

export default InputTagsFormItem;
