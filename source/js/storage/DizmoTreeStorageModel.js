export default class DizmoTreeStorageModel {
  constructor(storageKey='diagram') {
    this.storageKey = storageKey
    this.repo = dizmo.publicStorage
  }
  observe (callback, key=this.storageKey) {
    this.repo.subscribeToProperty(key, (_, newval) => {
      callback(newval)
    })
  }

  read (key=this.storageKey) {
    var item = this.repo.getProperty(key)
    //return JSON.parse(item)
    return item
  }

  write (value, key=this.storageKey) {
    this.repo.setProperty(key, value)
  }
}
