import ReduxConnector from '~/library/ReduxConnector'
import { clearCellData, setCellData } from '~/actions/tableDataActions'


const reduxConnector = new ReduxConnector()

const dispatchFunctions = {
  clearCellData,
  setCellData,
}

reduxConnector.registerFunctions(dispatchFunctions)

class ReduxStore {
  constructor(rc=reduxConnector) {
    const { rows, columns } = rc.getState().global
    this.rows = rows
    this.columns = columns
    this.reduxConnector = rc
  }

  get tableData() {
    return this.reduxConnector.getState().tableData
  }

  get locations() {
    return Object.keys(this.tableData)
  }

  getCellResult(location) {
    const data = this.tableData[location]
    return data && data.result
  }

  setCellData(location, entered, result) {
    this.reduxConnector.fn.setCellData(location, entered, result)
  }

  clearCellData(location) {
    this.reduxConnector.fn.clearCellData(location)
  }
}

export default ReduxStore
export { dispatchFunctions }
