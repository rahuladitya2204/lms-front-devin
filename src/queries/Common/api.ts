import { PresignedUrlRequestData, PresignedUrlResponseData } from '../../types/Common.types'

import Axios from '../../utils/network'
import { AxiosRequestConfig } from 'axios'

export const GetFileUrls = (
  files: { fileType: string }[]
): Promise<PresignedUrlResponseData[]> => {
  return Axios.post(`/file/url`, { files: files }).then(({ data }) => data)
}

export const UploadFile = (
  url: string,
  file: File,
  options: AxiosRequestConfig
) => {
  return Axios.put(url, file, options)
}
