import { inflateRaw, deflateRaw } from 'pako'

export function decodeModel (data) {
  // data = dizmo.publicStorage.getProperty('diagram').xml
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(data, 'text/xml')
  var base64EncodedDiagram = xmlDoc.querySelector('diagram').textContent

  var decoded = atob(base64EncodedDiagram)

  var inflated = inflateRaw(Uint8Array.from(decoded, c => c.charCodeAt(0)), {
    to: 'string'
  })

  var urldecoded = decodeURIComponent(inflated)
  return urldecoded
}

export function encodeModel (data) {
  var encoded = encodeURIComponent(data.data)
  var deflated = String.fromCharCode.apply(null, new Uint8Array(deflateRaw(encoded)))
  var base64encoded = btoa(deflated)
  return base64encoded
}
