export default class CORSCommunicator {
  constructor (target) {
    this.target = target
  }
  send (message) {
    var stringified = JSON.stringify(message)
    this.target.contentWindow.postMessage(stringified, '*')
  }
  receive (callback) {
    window.addEventListener('message', callback)
  }
}
