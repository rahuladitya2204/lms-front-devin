import { Button, Col, Form, Popover, Row } from "antd";
import { Types, User } from "@Common";

import TextArea from "@Components/Textarea";

interface GenerateWithAiPropsI {
    channel: string;
    campaign: Types.Campaign;
    onComplete: (d: { body: string, subject: string }) => void;
}

export default function GenerateWithAi(props:GenerateWithAiPropsI) {
    const { mutate: generateContent,isLoading: loadingCampaign} = User.Queries.useGenerateCampaignContent();
    const [aiForm] = Form.useForm();
    return <Popover title="Tell us about the campaign bit more in atleast 50 words to generate subject and body with AI"
    trigger="click" placement='right'
              content={<>
                  <Form onFinish={({prompt}) => {
                             generateContent({
                              title: props.campaign.title,
                              description: props.campaign.description,
                                 channel: [props.channel],
                            //   @ts-ignore
                              prompt
                          }, {
                              onSuccess: ({ data }) => {
                                  const D = {
                                    body: data.content,
                                    subject: data.subject
                                }
                                  console.log(data,'aaaa')
                                  props.onComplete(D)
                              }
                          })
                  }} form={aiForm}>
                  <Form.Item name='prompt'>
                  <TextArea style={{minHeight:100}}/>
                  </Form.Item>
                  <Row justify={'end'}>
                      <Col>
                      <Button type='primary' size='small' loading={loadingCampaign} onClick={() => {
           aiForm.submit()
                  }}>Generate Text</Button></Col>
                  
           </Row>
                 </Form>
              
              </>}>
              <Button type="default">
                  Generate With AI
              </Button>
              </Popover>
}