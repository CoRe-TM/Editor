import CORSCommunicator from './CORSCommunicator.js'
import DrawioStateController from './DrawioStates.js'

var iframe = document.createElement('iframe')
iframe.src = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&proto=json&configure=1'
iframe.classList.add('embedEditor')


const elt = document.querySelector('.diagram')

const drawioView = new CORSCommunicator(iframe)
const stateController =  new DrawioStateController(drawioView)

window.addEventListener('storage', (e) => {
  console.log('storage!')
  if(e.key !== 'diagram') {
    return
  }

  var record = JSON.parse(e.newValue)
  if(record.clientId === clientId) {
    return
  }
  var { xml } = record
  iframe.contentWindow.postMessage(JSON.stringify({
    "action": "merge",
    "xml": xml 
  }), '*')
})




document.body.appendChild(iframe)

