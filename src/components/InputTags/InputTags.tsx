import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import './style.css'
interface InputTagsPropsI {
  values?: string[];
  name?: string;
  ctaText?: string;
  onChange?: (tags: string[]) => void;
}

const InputTags: React.FC<InputTagsPropsI> = (props) => {
  const [tags, setTags] = React.useState(
    (props.values || []).map((value) => ({ id: value, text: value }))
  );

  const handleDelete = (i: number) => {
    const newTags = tags.slice(0);
    newTags.splice(i, 1);
    setTags(newTags);
    props.onChange && props.onChange(newTags.map((tag) => tag.text));
  };

  const handleAddition = (tag: { id: string; text: string }) => {
    setTags([...tags, tag]);
    props.onChange && props.onChange([...tags, tag].map((tag) => tag.text));
  };

  return (
    <ReactTags
      tags={tags}
      handleDelete={handleDelete}
      handleAddition={handleAddition}
      allowDragDrop={false}
      placeholder={props.ctaText || 'New Tag'}
    />
  );
};

export default InputTags;
