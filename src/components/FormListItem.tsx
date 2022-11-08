import 'react-quill/dist/quill.snow.css'

import { Button, Form, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { Fragment } from 'react';
import styled from '@emotion/styled';

interface FormListItemPropsI {
    label: string;
    name: string;
    placeholder: string;
    minItems?: number
  required?: boolean;
  initialValue?: string[];
}

const RemoveItemIcon = styled(MinusCircleOutlined)`
    margin-left: 10px;

`

const ListItem = styled(Form.Item)`
    input.ant-input{
        width: 90% !important;
    }

    .ant-form-item-explain-error{
        margin-top: 5px;
        margin-bottom: 5px;
    }
`

const ListItemHolder = styled.div`
margin-top: 10px;


`

function FormListItem(props: FormListItemPropsI) {
  return <Form.List initialValue={ props.initialValue}
  name={props.name}
  rules={props.minItems?[
    {
          validator: async (_, names) => {
            if (!props.minItems)
            {
                return true;
            }
        if (!names || names.length < (props.minItems)) {
            return Promise.reject(new Error(`At least ${props.minItems} required`));
            // TODO
        }
      },
    },
  ]:[]}
>
  {(fields, { add, remove }, { errors }) => (
          <>
               <Form.Item
          label={props.label}
          required={props.required}
        >
      {fields.map((field, index) => (

          <ListItemHolder key={index}>
        <ListItem
            {...field}
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter a valaue or delete this field.",
              },
            ]}
            noStyle
          >
            <Input placeholder={props.placeholder} style={{ width: '60%' }} />
          </ListItem>

            <RemoveItemIcon
              className="dynamic-delete-button"
              onClick={() => remove(field.name)}
            />

        </ListItemHolder>

      ))}
              </Form.Item>
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add()}
          style={{ width: '60%' }}
          icon={<PlusOutlined />}
        >
          Add Item
        </Button>
        <Form.ErrorList errors={errors} />
      </Form.Item>
    </>
  )}
</Form.List>}

export default FormListItem;
