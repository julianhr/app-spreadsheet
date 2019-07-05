import ReduxConnector from '~/library/ReduxConnector'
import { setCellData, clearCellData } from '~/actions/tableDataActions'
import { setActiveCell } from '~/actions/globalActions'


const reduxConnect = new ReduxConnector()

reduxConnect.registerFunctions({
  clearCellData,
  setActiveCell,
  setCellData,
})

export default reduxConnect
