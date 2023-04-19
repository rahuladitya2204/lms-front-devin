import { Common, Learner, Store } from '@adewaskar/lms-common'

import CoursePlayerTextItem from './CoursePlayerItems/Text'
import { Fragment } from 'react'
import MediaPlayer from '@Components/MediaPlayer'
import PDFViewer from '@Components/PDFViewer'
import VideoPlayer from '@Components/VideoPlayer'
import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks'

function CoursePlayerItem () {
  const user = Store.useAuthentication(s => s.user)
  const item = useGetNodeFromRouterOutlet()
  const { data: file } = Common.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  let Component
  if (item.type === 'text') {
    Component = <CoursePlayerTextItem item={item} />
  }

  if (item.type === 'video') {
    Component = (
      <MediaPlayer
        watermark={` <div>
         <p>${user.name}</p>
         <p>${user.contactNo}</p>
       </div>`}
        file={file}
      />
    )
  }

  if (item.type === 'pdf') {
    Component = <PDFViewer file={file} />
  }
  return <Fragment>{Component}</Fragment>
  // return null;
}

export default CoursePlayerItem
