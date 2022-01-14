export default class CORSCommunicator {
  constructor (target) {
    this.target = target
    if(!target.src) {
      throw new Error('src attribute should be set to derive origin')
    }
    this.origin = new URL(this.target.src).origin
  }
  send (message) {
    var stringified = JSON.stringify(message)
    this.target.contentWindow.postMessage(stringified, '*')
  }
  receive (callback) {
    window.addEventListener('message', (event) => {
      var comesFromTargetIframe = event.origin === this.origin
      if (comesFromTargetIframe) {
        callback(event)
      }
    })
  }
}
