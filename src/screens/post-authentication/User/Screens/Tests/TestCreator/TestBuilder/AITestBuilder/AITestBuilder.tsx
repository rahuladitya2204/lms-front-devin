import { Button, Col, Divider, Form, Input, Modal, Row } from 'antd'
import { DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { Types, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal/ActionModal';
import GenerateQuestionWithAI from '@User/Screens/ExtraComponents/QuizQuestions/GenerateQuestionWithAI';
import { uniqueId } from 'lodash';
import { useModal } from '@Components/ActionModal/ModalContext';
import { useState } from 'react'

const { confirm } = Modal;


interface AITestPaperBuilderPropsI {
  closeModal?: Function;
  onValuesChange: Function;
  testId: string;
}

export default function AITestPaperBuilder({
  closeModal,
  onValuesChange
}: AITestPaperBuilderPropsI) {
  const [metas, setMetas] = useState([])
  const [form] = Form.useForm<Types.CreateTestWithAI>()
  const {
    mutate: generateTest,
    isLoading: loading
  } = User.Queries.useGenerateTestWithAI();
  const onSubmit = (e: Types.CreateTestWithAI) => {
    console.log(e, 'eee')
    // @ts-ignore
    e.sections = e.sections.map((s, ind) => {
      s.meta = metas[ind];
      return s;
    })
    generateTest({ data: e }, {
      onSuccess: (s: Types.TestSection[]) => {
        if (!s) {
          return;
        }
        s = s.map(s => {
          s.items = s.items.map(d => {
            if (d) {
              // @ts-ignore
              d.topics = d?.topics?.map(topic => {
                return {
                  title: topic,
                  // topicId: uniqueId()
                }
              })
            }
            return d;
          })
          return s;
        })
        onValuesChange(s);
        closeModal && closeModal();
      }
    })
    // console.log(e, 'eee')
  }
  const { openModal } = useModal()

  return (
    <Form form={form} layout='vertical' onFinish={onSubmit}>
      <Row>
        <Col>
          <Form.Item label={`Course`}
            rules={[
              { required: true, message: 'Please enter the subject.' },
            ]}
            name='courseTitle'
          >
            <Input />
          </Form.Item>
          <Divider />
          <Form.List name="sections">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row justify={'center'} align={'middle'} gutter={[10, 10]}>
                    <Col>
                      <Form.Item label={`Section Title`}
                        rules={[
                          { required: true, message: 'Please enter the answer.' },
                        ]}
                        name={[field.name, 'title']}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item label={`Total Questions`}
                        rules={[
                          { required: true, message: 'Please enter the question count.' },
                        ]}
                        name={[field.name, 'count']}

                      >
                        <Input type='number' />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Button onClick={() => {
                        openModal(<GenerateQuestionWithAI data={metas[index]} onSubmit={(e: any) => {
                          const M: any[] = [...metas];
                          M[index] = e;
                          // @ts-ignore
                          setMetas(M)
                        }} />)
                      }} >{metas[index] ? 'Edit Meta Data' : `Enter Metadata`}</Button>
                      {/* <ActionModal cta={<Button>{metas[index]?'Edit Meta Data':`Enter Metadata`}</Button>}>
                            <GenerateQuestionWithAI data={metas[index]} onSubmit={(e:any) => {
                                const M:any[] = [...metas];
                                M[index] = e;
                                // @ts-ignore
                                setMetas(M)
                            }} />
                  </ActionModal> */}
                      <DeleteTwoTone style={{ fontSize: 18, marginLeft: 20 }} onClick={e => {
                        confirm({
                          title: 'Are you sure?',
                          content: `You want to delete this answer`,
                          onOk() {
                            remove(index)
                          },
                          okText: 'Delete Answer'
                        })
                      }} />
                    </Col>

                  </Row>

                ))}
                <Button onClick={e => add()} icon={<PlusCircleTwoTone />}>Add Option</Button>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Button style={{ marginTop: 50 }} loading={loading} type="primary" onClick={form.submit}>
        Generate Test
      </Button>
    </Form>
  )
}
