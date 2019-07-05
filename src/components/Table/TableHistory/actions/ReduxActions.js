import reduxConnect from '../reduxConnect'


class ReduxActions {
  static reduxConnect = reduxConnect

  get reduxConnect() {
    return ReduxActions.reduxConnect
  }

  getCellData(location) {
    return this.reduxConnect.getState().tableData[location]
  }
}

export default ReduxActions
