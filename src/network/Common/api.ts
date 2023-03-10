// import axios, { AxiosRequestConfig } from 'axios'

import { Network, Types } from '@adewaskar/lms-common'

export const GetFileUrls = (
  files: { fileType: string }[]
): Promise<Types.PresignedUrlResponseData[]> => {
  return Network.Axios.post(`/file/url`, { files: files }).then(({ data }) => data)
}

export const UploadFile = (
  url: string,
  file: File
) => {
  return Network.Axios.put(url, file, {
    headers: {
      // "Content-Type": 'multipart/form-data; boundary=---daba-boundary---'
      'Content-Type': file.type
    }
  })
}
