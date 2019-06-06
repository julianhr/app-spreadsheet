import appStore from '~/reducers/'
import { clearCellData, replaceCellData } from '~/actions/tableActions'


class ReduxConnect {
  constructor(store=appStore) {
    const { global: globalState } = store.getState()
    this.store = store
    this.rows = globalState.rows
    this.columns = globalState.columns
  }

  get table() {
    return this.store.getState().table
  }

  get locations() {
    return Object.keys(this.table)
  }

  getCellResult(location) {
    const data = this.table[location]
    return data && data.result
  }

  replaceCellData(location, entered, result) {
    this.store.dispatch(replaceCellData(location, entered, result))
  }

  clearCell(location) {
    this.store.dispatch(clearCellData(location))
  }
}

export default ReduxConnect
export { appStore }
