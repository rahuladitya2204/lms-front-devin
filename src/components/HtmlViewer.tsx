function HtmlViewer(props: { content: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: props.content
      }}
    />
  )
}

export default HtmlViewer
