/* eslint-disable */

// @ts-nocheck

const LoadVideo = () => {
  console.log('reloading')
  !(function(e, t, i) {
    if (void 0 === e._dyntube_v1_init) {
      e._dyntube_v1_init = !0
      var a = t.createElement('script')
      ;(a.type = 'text/javascript'),
        (a.async = !0),
        (a.src = 'https://embed.dyntube.com/v1.0/dyntube.js'),
        t.getElementsByTagName('head')[0].appendChild(a)
    }
  })(window, document)
}

export default LoadVideo
