import axios, { AxiosRequestConfig } from 'axios'

import Axios from '..'
import { Types } from '@adewaskar/lms-common'

export const GetFileUrls = (
  files: { fileType: string }[]
): Promise<Types.PresignedUrlResponseData[]> => {
  return Axios.post(`/file/url`, { files: files }).then(({ data }) => data)
}

export const UploadFile = (
  url: string,
  file: File,
  options: AxiosRequestConfig
) => {
  return axios.put(url, file, {
    headers: {
      // "Content-Type": 'multipart/form-data; boundary=---daba-boundary---'
      'Content-Type': file.type
    }
  })
}
