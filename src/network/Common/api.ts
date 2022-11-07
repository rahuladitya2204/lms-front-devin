import { PresignedUrlRequestData, PresignedUrlResponseData } from '../../types/Common.types'
import axios, { AxiosRequestConfig } from 'axios'

import Axios from '..'

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
  return axios.put(url, file, {
    headers:{
      // "Content-Type": 'multipart/form-data; boundary=---daba-boundary---'
      "Content-Type": file.type,
    }
  })
}
