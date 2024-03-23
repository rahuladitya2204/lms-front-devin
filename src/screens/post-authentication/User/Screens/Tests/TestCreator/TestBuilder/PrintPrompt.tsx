import { Button, Col, Divider, Form, Row, Switch } from 'antd'

import { User } from '@adewaskar/lms-common'
import { printPdf } from '@Components/Editor/SunEditor/utils'
import useMessage from '@Hooks/useMessage'

interface PrintPromptPropsI {
  testId: string;
}

export default function PrintPrompt(props: PrintPromptPropsI) {
  const [form] = Form.useForm()
  const message = useMessage()
  const {
    mutate: printTest,
    isLoading: printingTest
  } = User.Queries.usePrintTest(props.testId + '')
  const onSubmit = (d: any) => {
    const body = {
      includeQuestions: false,
      includeSolutions: false,
      includeAnswers: false,
      split: false
    }

    if (d.questions) {
      body.includeQuestions = true
    }
    if (d.answers) {
      body.includeAnswers = true
    }
    if (d.solutions) {
      body.includeSolutions = true
    }

    if (d.full) {
      body.includeQuestions = true
      body.includeAnswers = true
      body.includeSolutions = true
    }
    body.split = d.split
    printTest(body, {
      onSuccess: (url: string) => {
        printPdf(url)
        message.open({
          type: 'success',
          content: 'Printing Done'
        })
      }
    })
  }
  const body = {
    questions: false,
    solutions: false,
    answers: false,
    full: false
  }
  body.questions = Form.useWatch(['questions'], form)
  body.answers = Form.useWatch(['answers'], form)
  body.solutions = Form.useWatch(['solutions'], form)
  const {
    mutate: printOmr,
    isLoading: printingOMR
  } = User.Queries.usePrintTest(props.testId)
  return (
    <Form style={{ marginTop: 15 }} form={form} onFinish={onSubmit}>
      <Row justify={'space-between'} align="middle">
        <Col>Question Paper</Col>
        <Col>
          <Form.Item
            name="questions"
            // label="Question Paper"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={'space-between'} align="middle">
        <Col> Answer Key</Col>
        <Col>
          <Form.Item
            name="answers"
            // label=""
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={'space-between'} align="middle">
        <Col> Solutions</Col>
        <Col>
          <Form.Item
            name="solutions"
            // label="Include Solutions"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={'space-between'} align="middle">
        <Col>Complete Test Paper</Col>
        <Col>
          <Form.Item
            name="full"
            // label="Complete Test Paper"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={'space-between'} align="middle">
        <Col> Split Page</Col>
        <Col>
          <Form.Item
            name="split"
            // label="Include Solutions"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 20]} justify={'end'}>
        <Col span={24}>
          <Button
            loading={printingTest}
            block
            type="primary"
            onClick={form.submit}
            disabled={
              !(body.questions || body.answers || body.solutions || body.full)
            }
          >
            Print Test Paper
          </Button>
        </Col>
        <Divider style={{ margin: 0 }} />
        <Col span={24}>
          <Button
            loading={printingOMR}
            block
            onClick={() =>
              printOmr(
                // @ts-ignore
                {
                  omr: true
                },
                {
                  onSuccess: pdfStr => {
                    //   console.log(pdfStr, 11)
                    printPdf(pdfStr)
                  }
                }
              )
            }
          >
            Print Blank OMR Sheet
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
