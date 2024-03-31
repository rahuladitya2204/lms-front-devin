import { Types, User } from '@adewaskar/lms-common'

import { useParams } from '@Router/index'

const WebpageViewer = () => {
  const { pageId } = useParams()
  const { data: { code: { html, css, js } } } = User.Queries.useGetWebsitePage(
    pageId + ''
  )
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <body dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

// const renderPage = () => {
//   return `<html></html>`
// }

export default WebpageViewer
