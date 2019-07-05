import appStore from '~/reducers/'


class ReduxConnector {
  constructor(store=appStore) {
    this.store = store
    this.funcs = {}
  }

  get fn() {
    return this.funcs
  }

  getState() {
    return this.store.getState()
  }

  registerFunctions(funcs) {
    for (let [name, fn] of Object.entries(funcs)) {
      this.funcs[name] = async function(...args) {
        await this.store.dispatch( fn(...args) )
      }.bind(this)
    }
  }
}

export default ReduxConnector
