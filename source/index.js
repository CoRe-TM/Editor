import CORSCommunicator from './js/CORSCommunicator.js'
import DrawioStateController from './js/drawio/DrawioController.js'
import LocalStorageModel from './js/storage/LocalStorageModel.js'

var iframe = document.createElement('iframe')
iframe.src = 'https://embed.diagrams.net/?embed=1&ui=min&theme=dark&spin=1&proto=json&configure=1&noExitBtn=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1'
iframe.classList.add('embedEditor')

const diagramContainer =  document.querySelector('#front')

const drawioView = new CORSCommunicator(iframe)
const localStorageModel = new LocalStorageModel()
const stateController = new DrawioStateController(drawioView, localStorageModel)

diagramContainer.appendChild(iframe)

