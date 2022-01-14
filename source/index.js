import CORSCommunicator from './js/CORSCommunicator.js'
import DrawioStateController from './js/drawio/DrawioController.js'
import DizmoTreeStorageModel from './js/storage/DizmoTreeStorageModel.js'
import { inflateRaw } from 'pako'
window.inflateRaw = inflateRaw

var iframe = document.createElement('iframe')
iframe.src = 'https://embed.diagrams.net/?embed=1&ui=min&theme=dark&spin=1&proto=json&configure=1&noExitBtn=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1'
iframe.classList.add('embedEditor')

const diagramContainer =  document.querySelector('#front')

const drawioView = new CORSCommunicator(iframe)
const dizmoTreeStorageModel = new DizmoTreeStorageModel()
const stateController = new DrawioStateController(drawioView, dizmoTreeStorageModel)

diagramContainer.appendChild(iframe)

