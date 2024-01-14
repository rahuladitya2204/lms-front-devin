import './index.css'
export default function PreviewSmsTemplate({ content }: { content: string }) {
  return <div className="sms-bubble sms-bubble-bottom-left">{content}</div>
}
