import ReduxActions from './ReduxActions'


class ClearFormula extends ReduxActions {
  constructor(location) {
    super()
    this.previous = this.getCellData(location)
    this.location = location
  }

  execute() {
    this.reduxConnect.fn.clearCellData(this.location)
    this.reduxConnect.fn.setActiveCell(this.location)
  }

  unexecute() {
    if (!this.previous) { return }
    const { entered, result } = this.previous
    this.reduxConnect.fn.setCellData(this.location, entered, result)
    this.reduxConnect.fn.setActiveCell(this.location)
  }
}

export default ClearFormula