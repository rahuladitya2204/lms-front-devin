import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Switch,
    message
} from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { User } from '@adewaskar/lms-common'
import Tabs from '@Components/Tabs';

interface CreateTextComponentPropsI {
    children?: ReactNode;
    data?: Types.Text;
    closeModal?: Function;
}

const AddText: React.FC<CreateTextComponentPropsI> = props => {
    const {
        mutate: createText,
        isLoading: createTextLoading
    } = User.Queries.useCreateText()
    const {
        mutate: updateText,
        isLoading: updateTextLoading
    } = User.Queries.useUpdateText()

    const [form] = Form.useForm()

    const onSubmit = (e: Types.Text) => {
        if (props.data) {
            updateText(
                { id: props.data._id, data: e },
                {
                    onSuccess: () => {
                        props.closeModal && props.closeModal()
                    }
                }
            )
        } else {
            createText({
                data: e
            }, {
                onSuccess: () => {
                    message.open({
                        type: 'success',
                        content: 'Learned added successfully'
                    })
                    props.closeModal && props.closeModal()
                }
            })
        }
    }

    useEffect(
        () => {
            form.setFieldsValue(props.data)
        },
        [props.data]
    )

    return (
        <Fragment>
            <Form form={form} onFinish={onSubmit} layout="vertical">
                <Form.Item
                    rules={[
                        { required: true, message: 'Please enter key of the text' }
                    ]}
                    name="key"
                    label="Text Key"
                    required
                >
                    <Input placeholder="Text Key" />
                </Form.Item>

                <Tabs
                    tabKey="add-text"
                    items={Constants.LANGUAGES.map((language) => {
                        return {
                            label: language.label,
                            key: language.value,
                            children: (
                                <>
                                    <Form.Item
                                        required
                                        name={["text", language.value]}
                                        label="Text"
                                    >
                                        <Input placeholder="Please enter the text" />
                                    </Form.Item>
                                </>
                            ),
                        };
                    })}
                />
                <Row justify={'end'}>
                    <Col>
                        <Button
                            loading={createTextLoading || updateTextLoading}
                            key="submit"
                            type="primary"
                            htmlType="submit"

                        >
                            {props.data?._id ? 'Update Text' : 'Add Text'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}

export default AddText
