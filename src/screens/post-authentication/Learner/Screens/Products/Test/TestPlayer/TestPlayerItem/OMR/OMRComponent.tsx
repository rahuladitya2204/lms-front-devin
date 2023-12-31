import { Button, Checkbox, Col, Divider, Form, Modal, Radio, Row, Space, Typography } from 'antd';
import { Enum, Learner } from '@adewaskar/lms-common';
import React, { useEffect } from 'react';

import { ReloadOutlined } from '@ant-design/icons';
import { Title } from '@Components/Typography/Typography';
import useBreakpoint from '@Hooks/useBreakpoint';
import useMessage from '@Hooks/useMessage';

const confirm = Modal.confirm;

interface OMRComponentPropsI {
  testId: string;
  closeModal?: Function;
}

const OMRComponent: React.FC<OMRComponentPropsI> = ({ testId ,closeModal}) => {
  const { data: test } = Learner.Queries.useGetTestDetails(
    testId,
    Enum.TestDetailMode.TEST
  );
  const { data: { status: { sections } } } = Learner.Queries.useGetTestStatus(
    testId + ''
  );;
  
  
  const { mutate: submitResponses,isLoading: submittingResponses } = Learner.Queries.useSubmitTestResponses(testId);

  useEffect(() => { 
    const items = sections.map(i => i.items).flat()
      .map(i => {
        // console.log(i,'item')
        return i.type === Enum.TestQuestionType.SINGLE ?
          ((i.answerGiven?.options) ? (i.answerGiven?.options[0]) : null) :
          (i?.answerGiven?.options)
      });
    // console.log(items,'items')
    form.setFieldValue(['answers'], items);
  },[sections])
  
  const items = test?.sections?.map(i => i.items).flat() || [];
  const [form] = Form.useForm();
  const message = useMessage();
  const splitAfter = 30; // Adjust as needed

  const formatQuestionNumber = (number: number) => {
    return  isMobile?number: number.toLocaleString('en-US', {
      minimumIntegerDigits: 3,
      useGrouping: false
    });
  };

  const handleSubmit = (values: any) => {
    const resp:any[] = []
    // console.log(values,'vv')
    // @ts-ignore
   items
      .forEach((item, index) => {
        const i={
          questionId: item._id,
          question: item._id,
          submittedAt: new Date(),
          answer: {
            options: item.type===Enum.TestQuestionType.SINGLE?[values.answers[index]]: values.answers[index]
          }
        }
        if (values.answers[index]) {
          resp.push(i)
        }
      })
      // .filter(question => question.options != null && question.options.length > 0);

    // console.log(resp);
    submitResponses(resp, {
      onSuccess: () => {
        message.open({
          type: 'success',
          content: "Answers Recorded"
        });
        closeModal && closeModal();
      }
    })
    // Submit `answeredQuestions` to your API or handle it as needed
  };
  const { isDesktop, isMobile } = useBreakpoint();
  const splitIndex = Math.ceil(items.length / 2);
  const ResetAnswerButton = <Button block={isMobile}  onClick={() => {
     confirm({
            title: 'Are you sure?',
            // icon: <ExclamationCircleOutlined />,
            content: `You want to reset answer sheet`,
            onOk() {
              form.resetFields();
              // form.submit()
              message.open({ type: "info", content: 'Answer Sheet Resetted' })

            },
            okText: 'Yes, Reset'
          })
  }}>Reset Answer Sheet</Button>;
  return (
    <Form form={form} className="omr-sheet" onFinish={handleSubmit}>
      <Row style={{marginTop:20}} justify={'space-between'} align={'middle'}>
        {/* <Col><Title level={3}>Answer Sheet</Title></Col> */}
       {/* {!isMobile? <Col>{ResetAnswerButton}</Col>:null} */}
      </Row>
      <Form.List name="answers">
        {(fields, { add, remove }) => (
          <>
                            <Row gutter={[5, 5]}>
{items.map((item, index) => {
                     const isInFirstColumn = index < splitAfter;
                     return (
              <Col xs={24} sm={24} md={12} lg={12}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
     <Row justify="start" align="middle" style={{alignItems:'baseline'}}>
                        <Col span={2}>
                          <Typography.Text strong>
                            {formatQuestionNumber(index + 1)}
                          </Typography.Text>
                        </Col>
                        <Col span={22}>
                                 <Row align={'middle'} justify={'center'} style={{alignItems:'baseline'}}>
                                   <Col><Form.Item name={[index]}>
                            {item.type === 'single' ? (
                              <Radio.Group>
                                {item.options.map((option) => (
                                  <Radio key={option._id} value={option._id}>
                                    { String.fromCharCode(65 + item.options.indexOf(option))}
                                  </Radio>
                                ))}
                              </Radio.Group>
                            ) : (
                              <Checkbox.Group>
                                {item.options.map((option) => (
                                  <Checkbox key={option._id} value={option._id}>
                                    {String.fromCharCode(65 + item.options.indexOf(option))}
                                  </Checkbox>
                                ))}
                              </Checkbox.Group>
                            )}
                                 </Form.Item>
                                   </Col>
                                   <Col>
                                     <Button type='primary' onClick={() => {
      // const resetValue = item.type === Enum.TestQuestionType.SINGLE ? undefined : [];
      form.resetFields([`answers[${index}]`]);
                                      // form.resetFields([`answers[${index}]`]);
                                   }} shape='circle' icon={<ReloadOutlined />} size='small' ></Button>
                                   </Col>
                          </Row>
                        </Col>
                             </Row>
                             </Space>
                  </Col>
              )
            })}
                         </Row>
 </>
        )}
      </Form.List>
      <Divider/>
      <Row gutter={[20,20]} justify={'space-between'}>
        <Col>{ ResetAnswerButton}</Col>
        <Col> <Form.Item>
        <Button block={isMobile} loading={submittingResponses} type="primary" htmlType="submit">
            Save Answers
        </Button>
      </Form.Item></Col>
     </Row>
    </Form>
  );
};

export default OMRComponent;
