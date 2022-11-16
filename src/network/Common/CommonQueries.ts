import { GetFileUrls, UploadFile } from './api'

import { UploadFileType } from '@Types/Common.types'
import { config } from '../../constants/config'
import { useMutation } from '@tanstack/react-query'
import { AxiosProgressEvent } from 'axios'

export const useUploadFiles = () => {
  const mutation = useMutation(
    ({
      files,
      onUploadProgress,
      onSuccess
    }: {
      files: File[],
      onUploadProgress?: (e: AxiosProgressEvent) => void,
      onSuccess: (files: UploadFileType[]) => void
    }) => {
      const keys = files.map(file => {
        return {
          fileType: file.type,
          fileName: file.name
        }
      })
      return GetFileUrls(keys).then(data => {
        const requests = data.map((d, index: number) => {
          const httpOptions = {
            headers: {
              'Content-Type': files[index].type
            },
            onUploadProgress: onUploadProgress
          }
          return UploadFile(d.url, files[index], httpOptions)
        })
        return Promise.all(requests).then(data => {
          const files = data.map((d, index) => {
            const file = {
              name: keys[index].fileName,
              url: config.S3_ASSET + '/' + keys[index].fileName
            }
            return file
          })
          onSuccess(files)
          return files
        })
      })
    }
  )

  return mutation
}
