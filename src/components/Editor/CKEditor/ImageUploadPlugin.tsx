// @ts-nocheck
export class MyUploadAdapter {
  constructor (loader, handleUpload) {
    this.loader = loader
    this.handleUpload = handleUpload
  }

  // Starts the upload process.
  upload () {
    return this.loader.file
      .then(file => this.handleUpload(file)) // Use the upload function here
      .then(response => {
        return response
      })
  }

  // Aborts the upload process.
  abort () {
    if (this.xhr) {
      this.xhr.abort()
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest () {
    const xhr = (this.xhr = new XMLHttpRequest())

    // Your upload URL
    xhr.open('POST', 'YOUR_UPLOAD_ENDPOINT', true)
    xhr.responseType = 'json'
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners (resolve, reject, file) {
    const xhr = this.xhr
    const loader = this.loader
    const genericErrorText = `Couldn't upload file: ${file.name}.`

    xhr.addEventListener('error', () => reject(genericErrorText))
    xhr.addEventListener('abort', () => reject())
    xhr.upload.addEventListener('progress', evt => {
      if (evt.lengthComputable) {
        loader.uploadTotal = evt.total
        loader.uploaded = evt.loaded
      }
    })

    xhr.addEventListener('load', () => {
      const response = xhr.response
      if (!response || !response.uploaded) {
        return reject(
          response && response.error && response.error.message
            ? response.error.message
            : genericErrorText
        )
      }
      resolve({
        default: response.url // Assuming the response contains the URL to the uploaded file
      })
    })
  }

  // Prepares the data and sends the request.
  _sendRequest (file) {
    const data = new FormData()
    data.append('upload', file)

    this.xhr.send(data)
  }
}

function MyCustomUploadAdapterPlugin (editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return new MyUploadAdapter(loader)
  }
}
