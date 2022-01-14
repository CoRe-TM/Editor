export default function decode (data) {
  // data = dizmo.publicStorage.getProperty('diagram').xml
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(data, 'text/xml')
  var diagram = xmlDoc.querySelector('diagram').textContent

  var decoded = atob(diagram)

  var inflated = inflateRaw(Uint8Array.from(decoded, c => c.charCodeAt(0)), {to: 'string'})

  var urldecoded = decodeURIComponent(inflated)
}
