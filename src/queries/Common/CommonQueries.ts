import { GetFileUrls, UploadFile } from './api'

import { UploadFileType } from '../../types/Common.types';
import { config } from '../../constants/config'
import { useMutation } from '@tanstack/react-query'

export const useUploadFiles = () => {
  const mutation = useMutation(
    ({
      files,
      onSuccess
    }: {
      files: File[],
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
            }
          }
          return UploadFile(d.url, files[index], httpOptions)
        })
        return Promise.all(requests).then(data => {
          const files = data.map((d, index) => {
            const file = {
              name: keys[index].fileName,
              url: config.S3_ASSET + '/' + keys[index].fileName
            };
            return file
          })
          onSuccess(files);
          return files;
        })
      })
    }
  )

  return mutation
}

