import ReduxActions from './ReduxActions'


class AddFormula extends ReduxActions {
  constructor(location, oldVertex, newVertex) {
    super()
    this.location = location
    this.entered = newVertex.entered
    this.result = newVertex.result
    this.previous = oldVertex && {
      entered: oldVertex.entered,
      result: oldVertex.result,
    }
  }

  execute() {
    this.reduxConnect.fn.setCellData(this.location, this.entered, this.result)
    this.reduxConnect.fn.setActiveCell(this.location)
  }

  unexecute() {
    if (this.previous) {
      const { entered, result } = this.previous
      this.reduxConnect.fn.setCellData(this.location, entered, result)
    } else {
      this.reduxConnect.fn.clearCellData(this.location)
    }

    this.reduxConnect.fn.setActiveCell(this.location)
  }
}

export default AddFormula
