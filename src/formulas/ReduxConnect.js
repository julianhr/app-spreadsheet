import appStore from '~/reducers/'
import { clearCellData, replaceCellData } from '~/actions/tableDataActions'


class ReduxConnect {
  constructor(store=appStore) {
    const { global: globalState } = store.getState()
    this.store = store
    this.rows = globalState.rows
    this.columns = globalState.columns
  }

  get tableData() {
    return this.store.getState().tableData
  }

  get locations() {
    return Object.keys(this.tableData)
  }

  getCellResult(location) {
    const data = this.tableData[location]
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
