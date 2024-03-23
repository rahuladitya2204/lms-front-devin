// @ts-nocheck
import { Common } from '@adewaskar/lms-common'
import Hls from 'hls.js'

export class CustomXhrLoader extends Hls.DefaultConfig.loader {
  constructor (config) {
    super(config);
    this.cache = new Map();
  }

  async load (context, config, callbacks) {
    if (context.url && !this.cache.has(context.url)) {
      try {
        const presignedUrl = await Common.Api.GetPresignedUrl(context.url);
        this.cache.set(context.url, presignedUrl);
        context.url = presignedUrl;
      } catch (er) {
        // Handle error, potentially invoking callbacks.onError
        return;
      }
    } else if (this.cache.has(context.url)) {
      // Use the cached URL
      context.url = this.cache.get(context.url);
    }

    // Call the parent load method with the modified context
    super.load(context, config, callbacks);
  }
}
