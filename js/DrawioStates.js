export default class DrawioStateController {
  constructor (drawio, storage) {
    this.drawio = drawio
    this.storage = storage
    this.clientId = Math.random() * 10e15

    this.storage.onChange(this.mergeChanges.bind(this))
    this.drawio.receive(this.handleIncomingEvents.bind(this))
  }

  handleIncomingEvents (message) {
    if(message.data.length <= 0) {
      return console.log('Empty event received:', message)
    }
    var msg = JSON.parse(message.data);
    var { event } = msg

    if (event === 'configure') {
      this.configureDrawio()
    } else if (event === 'init') {
      this.loadDrawio()
    } else if (event === 'export') {
      this.storeDiagram(msg)
      this.close()
    } else if (event === 'autosave') {
      // console.log('Autosave', msg.xml)
      this.autoSaveDiagram(msg)
    } else if (event === 'save') {
      // TODO
      // iframe.contentWindow.postMessage(JSON.stringify({action: 'export', format: 'xmlsvg', xml: msg.xml, spin: 'Updating page'}), '*'); localStorage.setItem('diagram' + name, JSON.stringify({lastModified: new Date(), xml: msg.xml}));
    }
  }
  configureDrawio () {
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
    this.drawio.send(configurationAction)
  }

  loadDrawio () {
    var draft = localStorage.getItem('diagram');
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

      this.drawio.send(loadAction)
      this.drawio.send(statusAction)
    } else {
      // Avoids unescaped < and > from innerHTML for valid XML
      var svg = new XMLSerializer().serializeToString(elt.firstChild);
      var loadAction = {
        action: 'load',
        autosave: 1,
        xml: svg
      }
      this.drawio.send(loadAction)
    }
  }

  mergeChanges () {
  }
  storeDiagram (msg) {
    var svg = atob(msg.data.substring(msg.data.indexOf(',') + 1));
    localStorage.setItem('diagram', JSON.stringify({
      lastModified: new Date(),
      data: svg
    }))
  }
  autoSaveDiagram(msg) {
    localStorage.setItem('diagram', JSON.stringify({
      lastModified: new Date(),
      savedBy: this.clientId,
      xml: msg.xml
    }))
  }
  close () {
    // TOOD
    console.error('To be implemented')
  }
}

