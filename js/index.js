class CORSCommunicator {
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

var iframe = document.createElement('iframe')
iframe.src = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&proto=json&configure=1'
iframe.classList.add('embedEditor')

const clientId = Math.random()*10e15

const elt = document.querySelector('.diagram')
var draft = localStorage.getItem('diagram');

//window.addEventListener('message', handleIncomingEvents)

const drawio = new CORSCommunicator(iframe)
drawio.receive(handleIncomingEvents)

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

function handleIncomingEvents (message) {
  const name = 'default'
  if (message.data.length > 0) {
    var msg = JSON.parse(message.data);

    if (msg.event == 'configure') {
      configureDrawio()
    }
    else if (msg.event == 'init') {
      loadDrawio()
    } else if (msg.event == 'export') {
      storeDiagram(msg)
      close();
    } else if (msg.event == 'autosave') {
      // console.log('Autosave', msg.xml)
      autoSaveDiagram(msg)
    } else if (msg.event == 'save') {
      // TODO
      // iframe.contentWindow.postMessage(JSON.stringify({action: 'export', format: 'xmlsvg', xml: msg.xml, spin: 'Updating page'}), '*'); localStorage.setItem('diagram' + name, JSON.stringify({lastModified: new Date(), xml: msg.xml}));
    }
  }
}

function configureDrawio () {
  var configurationAction = {
    action: 'configure',
    config: {
      defaultFonts: [
        "Humor Sans",
        "Helvetica",
        "Times New Roman"
      ]
    }
  }
  drawio.send(configurationAction)
}

function loadDrawio () {
  if (draft != null) {
    var rec = JSON.parse(draft)
    var loadAction = {
      action: 'load',
      autosave: 1,
      xml: rec.xml
    }

    var statusAction = {
      action: 'status',
      modified: true
    }

    drawio.send(loadAction)
    drawio.send(statusAction)
  } else {
    // Avoids unescaped < and > from innerHTML for valid XML
    var svg = new XMLSerializer().serializeToString(elt.firstChild);
    var loadAction = {
      action: 'load',
      autosave: 1,
      xml: svg
    }
    drawio.send(loadAction)
  }
}
function storeDiagram (msg) {
  var svg = atob(msg.data.substring(msg.data.indexOf(',') + 1));
  localStorage.setItem('diagram', JSON.stringify({
    lastModified: new Date(),
    data: svg
  }));
}
function autoSaveDiagram(msg) {
  localStorage.setItem('diagram', JSON.stringify({
    lastModified: new Date(),
    savedBy: clientId,
    xml: msg.xml
  }));
}

function close () { console.log('To be implemented')}

document.body.appendChild(iframe)

