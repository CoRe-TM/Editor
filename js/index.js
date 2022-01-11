import CORSCommunicator from './CORSCommunicator.js'
import DrawioStateController from './drawio/DrawioController.js'
import LocalStorageModel from './storage/LocalStorageModel.js'

var iframe = document.createElement('iframe')
iframe.src = 'https://embed.diagrams.net/?embed=1&ui=min&theme=dark&spin=1&proto=json&configure=1&noExitBtn=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1'
iframe.classList.add('embedEditor')

const diagramTemplate = document.querySelector('.diagram')

const drawioView = new CORSCommunicator(iframe)
const localStorageModel = new LocalStorageModel()
const stateController =  new DrawioStateController(drawioView, localStorageModel, diagramTemplate)

document.body.appendChild(iframe)

