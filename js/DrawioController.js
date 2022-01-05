import strideTMLib from './drawiolibs/stride-coretm-lib.js'
import strideTemplate from './drawiolibs/stride-coretm-template.js'

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
        ui: 'min',
        defaultLibraries: 'general;company-graph;Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fmichenriksen%2Fdrawio-threatmodeling%2Fmaster%2Fdfd.xml;dfd;threatModeling',
        enabledLibraries: ['general', 'company-graph', 'dfd', 'dfd.xml', 'Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fmichenriksen%2Fdrawio-threatmodeling%2Fmaster%2Fdfd.xml', 'threatModeling'],
          libraries: [ {
           "title": {
           "main": "Company"
           },
           "entries": [ {
          "id": "company-graph",
          "title": {
            "main": "Graphics",
            "de": "Grafiken"
          },
          "desc": {
            "main": "Collection of Graphics for Company",
            "de": "Sammlung von Grafiken für Firma"
          },
          "libs": [ {
           "title": {
             "main": "GG",
             "de": "GG"
           },
           "data": [ {
               "xml": "jZLBbsMgDIafhmuUgKr1mqZbL5u0VyCJF5BMHIHbpG9fEti6Tqq0A5L5/NuYH4Rq3HLyejIf1AMK9SpU44k4RW5pAFHI0vZCHYWUZVxCvj3JVlu2nLSHkf9TIFPBReMZEkkg8BUz6HUwsMpLoQ50ZrQjNDSO0HGGhl0c/FjFUKMdxhh38XzwEaBuAT8pWLb0kLiAZ9tpfP8jaImZ3C9BnVsyTZEGo6d1MLcMq2nFDC3SQKHovZ4tySj5sogNIfltflXVu0Ot8j1jT1ieerWhbNQJyAH7a5TMtmeTFDtZZIcM2MHkupey2CeqQyLDT/Xd/Bhk/7+393fecg/f4AY=",
               "w": 52.2,
               "h": 70.8,
               "aspect": "fixed"
             } ]
            } ]
           } ]
          } ],
        css: `.geMenubarContainer {
              }
              .geMenubar {
                /*background-color: #F08705 !important;*/
              }
              .geDiagramContainer {
                overflow: hidden !important;
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

