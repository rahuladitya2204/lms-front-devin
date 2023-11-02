function HtmlViewer(props: { content: string }) {
  // @ts-ignore
  const children = props.children || props.content
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: children
      }}
    />
  )
}

export default HtmlViewer
