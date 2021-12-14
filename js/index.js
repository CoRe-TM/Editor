var iframe = document.createElement('iframe')
iframe.src = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&proto=json&configure=1'
iframe.classList.add('embedEditor')

const clientId = Math.random()*10e15

const elt = document.querySelector('.diagram')
var draft = localStorage.getItem('diagram');

window.addEventListener('message', handleIncomingEvents)

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
      iframe.contentWindow.postMessage(JSON.stringify({
        action: 'configure',
        config: {defaultFonts: ["Humor Sans", "Helvetica", "Times New Roman"]}}), '*');
    }
    else if (msg.event == 'init') {
      if (draft != null) {
        var rec = JSON.parse(draft)
        iframe.contentWindow.postMessage(JSON.stringify({action: 'load',
          autosave: 1, xml: rec.xml}), '*');
        iframe.contentWindow.postMessage(JSON.stringify({action: 'status',
          modified: true}), '*');
      } else {
        // Avoids unescaped < and > from innerHTML for valid XML
        var svg = new XMLSerializer().serializeToString(elt.firstChild);
        iframe.contentWindow.postMessage(JSON.stringify({action: 'load',
          autosave: 1, xml: svg}), '*');
      }
    } else if (msg.event == 'export') {
      // Extracts SVG DOM from data URI to enable links
      var svg = atob(msg.data.substring(msg.data.indexOf(',') + 1));
      elt.innerHTML = svg;
      localStorage.setItem('diagram', JSON.stringify({lastModified: new Date(), data: svg}));
      draft = null;
      close();
    } else if (msg.event == 'autosave') {
      console.log('Autosave', msg.xml)
      localStorage.setItem('diagram', JSON.stringify({lastModified: new Date(), savedBy: clientId, xml: msg.xml}));
    } else if (msg.event == 'save') {
      iframe.contentWindow.postMessage(JSON.stringify({action: 'export',
        format: 'xmlsvg', xml: msg.xml, spin: 'Updating page'}), '*');
      localStorage.setItem('diagram' + name, JSON.stringify({lastModified: new Date(), xml: msg.xml}));
    } else if (msg.event == 'exit') {
      localStorage.removeItem('.draft-' + name);
      draft = null;
      close();
    }
  }
}

function close () { console.log('To be implemented')}

document.body.appendChild(iframe)

