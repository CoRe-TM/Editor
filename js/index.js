var iframe = document.createElement('iframe')
iframe.src = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&proto=json&configure=1'
iframe.classList.add('embedEditor')

const clientId = Math.random()*10e15

var draft = localStorage.getItem('.draft-' + name);
const elt = document.querySelector('.diagram')


window.addEventListener('message', handleIncomingEvents)

window.addEventListener("storage", (e) => {
  if(e.key !== 'diagram') {
    return
  }

  var record = JSON.parse(e.newValue)
  if(record.clientId === clientId) {
    return
  }
  var { diagram } = record
  iframe.contentWindow.postMessage(JSON.stringify({
    "action": "merge",
    "xml": diagram 
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
        iframe.contentWindow.postMessage(JSON.stringify({action: 'load',
          autosave: 1, xml: draft.xml}), '*');
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
      localStorage.setItem(name, JSON.stringify({lastModified: new Date(), data: svg}));
      localStorage.removeItem('.draft-' + name);
      draft = null;
      close();
    } else if (msg.event == 'autosave') {
      localStorage.setItem('.draft-' + name, JSON.stringify({lastModified: new Date(), xml: msg.xml}));
    } else if (msg.event == 'save') {
      iframe.contentWindow.postMessage(JSON.stringify({action: 'export',
        format: 'xmlsvg', xml: msg.xml, spin: 'Updating page'}), '*');
      localStorage.setItem('.draft-' + name, JSON.stringify({lastModified: new Date(), xml: msg.xml}));
    } else if (msg.event == 'exit') {
      localStorage.removeItem('.draft-' + name);
      draft = null;
      close();
    }
  }
}

function close () { console.log('To be implemented')}

document.body.appendChild(iframe)

