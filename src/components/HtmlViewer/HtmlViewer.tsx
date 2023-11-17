import './style.css'
function HtmlViewer(props: { content: string }) {
  // @ts-ignore
  const children = props.children || props.content
  return (
    <div
      // className="sun-editor-editable"
      dangerouslySetInnerHTML={{
        __html: children
      }}
    />
  )
}

export default HtmlViewer
