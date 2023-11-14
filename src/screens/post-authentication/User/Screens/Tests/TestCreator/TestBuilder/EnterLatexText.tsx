import { Button, Form } from 'antd'

import TextArea from '@Components/Textarea'
import katex from 'katex'

interface EnterLatexTextPropsI {
  onFinish: (str: string) => void;
}

const EnterLatexText = (props: EnterLatexTextPropsI) => {
  const [form] = Form.useForm()
  return (
    <Form
      form={form}
      onFinish={e => {
        console.log(e.latexStr, '12')
        const htmlStr = renderKaTeXInString(e.latexStr)
        console.log(htmlStr, 'poipopo')
        props.onFinish(htmlStr)
      }}
    >
      <Form.Item name="latexStr">
        <TextArea height={500} />
      </Form.Item>
      <Button onClick={form.submit} type="primary">
        Convert
      </Button>
    </Form>
  )
}

function renderKaTeXInString(inputString: string): string {
  // Regular expression to find all LaTeX expressions enclosed in $...$
  const regex = /\$(.*?)\$/g

  // Function to render individual LaTeX expression
  const renderLaTeX = (latex: string): string => {
    try {
      return katex.renderToString(latex, {
        throwOnError: true,
        displayMode: false // Set to 'false' for inline mode
      })
    } catch (error) {
      console.error('KaTeX rendering error: ', error)
      return `<span class="katex-error">Error rendering KaTeX expression</span>`
    }
  }

  // Replace each LaTeX expression in the string with its rendered HTML
  return inputString.replace(regex, (_, latexExpression) =>
    renderLaTeX(latexExpression)
  )
}

export default EnterLatexText
