export default class DizmoTreeStorageModel {
  constructor(storageKey='diagram') {
    this.storageKey = storageKey
    this.repo = dizmo.publicStorage
  }
  observe (callback) {
    dizmo.publicStorage.subscribeToProperty(this.storageKey, (_, e) => {
      var record = JSON.parse(e.newValue)
      callback(record)
    })
  }

  read (key=this.storageKey) {
    var item = this.repo.getProperty(this.storageKey)
    //return JSON.parse(item)
    return item
  }

  write (value, key=this.storageKey) {
    localStorage.setItem(key, value)
  }
}
