import { Common, Types } from '@adewaskar/lms-common'

import { AxiosProgressEvent } from 'axios'
import { config } from '../../constants/config'
import { useMutation } from '@tanstack/react-query'

export const useUploadFiles = () => {
  const mutation = useMutation(
    ({
      files,
      onUploadProgress,
      onSuccess
    }: {
      files: File[],
      onUploadProgress?: (e: AxiosProgressEvent) => void,
      onSuccess: (files: Types.UploadFileType[]) => void
    }) => {
      const keys = files.map(file => {
        return {
          fileType: file.type,
          fileName: file.name
        }
      })
      return Common.Api.GetFileUrls(keys).then(data => {
        const requests = data.map((d, index: number) => {
          return Common.Api.UploadFile(d.url, files[index])
        });
        
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
