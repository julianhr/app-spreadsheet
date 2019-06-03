import { APP_STORE } from '~/Root'


class ReduxConnect {
  constructor() {
    this.state = APP_STORE.getState()
    this.table = this.state.table
    this.global = this.state.global
  }

  get rows() {
    return this.global.rows
  }

  get columns() {
    return this.global.columns
  }

  getCellFormulaRefs(location) {
    return this.table[location].cellRefs
  }

  getCellFormula(location) {
    return this.table[location].formula
  }

  getCellValue(location) {
    return this.table[location].value
  }

  getCellIsFormulaValid(location) {
    return this.table[location].isFormulaValid
  }
}

export default ReduxConnect
