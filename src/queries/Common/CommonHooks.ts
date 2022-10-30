import { GetFileUrls, UploadFile } from './api'

import { useMutation } from '@tanstack/react-query'

export const useUploadFiles = () => {
  const mutation = useMutation((files: File[]) => {
    const keys = files.map(file => {
      return {
        fileType: file.type,
        extension: file.name.split('.').pop()
      }
    })
    return GetFileUrls(keys).then(data => {
      console.log(data, 'data')
      const requests = data.map((d, index: number) => {
        const httpOptions = {
          headers: {
            'Content-Type': files[index].type
          }
        }
        console.log(files[index], 'files[index]')
        return UploadFile(d.url, files[index], httpOptions)
      })
      return Promise.all(requests)
    })
  })

  return mutation
}
