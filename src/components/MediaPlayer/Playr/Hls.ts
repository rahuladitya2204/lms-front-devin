// @ts-nocheck
import { Common } from '@adewaskar/lms-common'
import Hls from 'hls.js'

export class CustomXhrLoader extends Hls.DefaultConfig.loader {
  constructor (config) {
    super(config)
  }

  async load (context, config, callbacks) {
    console.log(context, 'tttt')
    // Modify the request URL for 720p variant
    // if (context.type === 'manifest' && context.level === 1) {
    // Replace the URL with your pre-signed URL
    if (context.url) {
      context.url = await Common.Api.GetPresignedUrl(context.url)
      console.log(context.url, 'aaaaa')
    }
    // }

    // Call the parent load method with the modified context
    super.load(context, config, callbacks)
  }
}
