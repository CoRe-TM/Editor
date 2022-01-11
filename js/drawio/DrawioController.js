import strideTMLib from '../drawiolibs/stride-coretm-lib.js'
import strideTemplate from '../drawiolibs/stride-coretm-template.js'
import cssVariables from '../../styles/variables.js'

export default class DrawioStateController {
  constructor (drawio, storage, diagramTemplate) {
    this.drawio = drawio
    this.storage = storage
    this.diagramTemplate = diagramTemplate
    this.clientId = Math.random() * 10e15

    this.storage.observe(this.mergeChanges.bind(this))
    this.drawio.receive(this.handleIncomingEvents.bind(this))
  }

  handleIncomingEvents (message) {
    if(message.data.length <= 0) {
      return console.log('Empty event received:', message)
    }
    var msg = JSON.parse(message.data)
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
      // iframe.contentWindow.postMessage(JSON.stringify({action: 'export', format: 'xmlsvg', xml: msg.xml, spin: 'Updating page'}), '*') localStorage.setItem('diagram' + name, JSON.stringify({lastModified: new Date(), xml: msg.xml}))
    }
  }
  configureDrawio () {
    var configurationAction = {
      action: 'configure',
      config: {
        defaultLibraries: 'coretm',
        defaultCustomLibraries: [ 'coretm'],
        enabledLibraries: [ 'coretm'],
          libraries: [ {
           "title": {
           "main": "coretm"
           },
           "entries": [ {
          "id": "coretm",
          "title": {
            "main": "Threat Modeling",
            "de": "Bedrohungsmodellierung"
          },
          "desc": {
            "main": "CoReTM Threat Modelling Assets",
            "de": "CoReTM Threat Modelling Assets"
          },
          "libs": [{
           "title": {
             "main": "STRIDE",
             "de": "STRIDE"
           },
           "data": strideTMLib
            },
           {
           "title": {
             "main": "PASTA",
             "de": "PASTA"
           },
           "data": ""
            },
           {
           "title": {
             "main": "Attack Trees",
             "de": "Angriffsbäume"
           },
           "data": ""
            }
          ]
          }]
        }],
        css: `
          .geMenubarContainer, .mxWindow {
            background-color: ${cssVariables['--coretm-lightgreen']} !important;
          }
          .geTitle, .mxWindowTitle, .geFormatSection {
            color: ${cssVariables['--coretm-darkgrey']} !important;
          }
          .geFormatSection:nth-of-type(3), .geFormatSection:nth-of-type(4) {
          display: none;

          }
          .geMenubar {
          }
          .geDiagramContainer {
            overflow: hidden !important;
          }
          .geToolbarButton[title=Language] {
            display: none;
          }
        `,
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
    var draft = this.storage.read()
    if (draft != null) {
      var rec = draft
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
      var loadAction = {
        action: 'load',
        autosave: 1,
        xml: strideTemplate
      }
      this.drawio.send(loadAction)
    }
  }

  mergeChanges (record) {
    if(record.clientId === this.clientId) {
      return
    }
    var { xml } = record
    var mergeAction = {
      "action": "merge",
      "xml": xml 
    }
    this.drawio.send(mergeAction)
  }

  storeDiagram (msg) {
    var svg = atob(msg.data.substring(msg.data.indexOf(',') + 1))
    this.storage.write({
      lastModified: new Date(),
      data: svg
    })
  }
  autoSaveDiagram (msg) {
    this.storage.write({
      lastModified: new Date(),
      savedBy: this.clientId,
      xml: msg.xml
    })
  }
  close () {
    // TOOD
    console.error('To be implemented')
  }
}

