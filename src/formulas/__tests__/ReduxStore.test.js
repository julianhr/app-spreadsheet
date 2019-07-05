import { appStoreGen } from '~/reducers/'
import ReduxStore, { dispatchFunctions } from '../ReduxStore'
import ReduxConnector from '~/library/ReduxConnector'


describe('ReduxStore', () => {
  let rs

  beforeEach(() => {
    const store = appStoreGen()
    const reduxConnector = new ReduxConnector(store)
    reduxConnector.registerFunctions(dispatchFunctions)
    rs = new ReduxStore(reduxConnector)
  })

  test('instantiation', () => {
    expect(rs).toMatchSnapshot()
  })

  test('get #tableData', () => {
    rs.setCellData('A-1', '7', 7)
    rs.setCellData('B-2', '=A1+3', 10)
    expect(rs.tableData).toMatchSnapshot()
  })

  test('get #locations', () => {
    rs.setCellData('A-1', '7', 7)
    rs.setCellData('B-2', '=A1+3', 10)
    expect(rs.locations).toEqual(['A-1', 'B-2'])
  })

  test('#getCellResult', () => {
    rs.setCellData('B-2', '=A1+3', 3)
    expect(rs.getCellResult('B-2')).toBe(3)
  })

  test('#setCellData', () => {
    rs.setCellData('B-2', '=A1+3', 3)
    expect(rs.tableData).toMatchSnapshot()

    rs.setCellData('B-2', '=c5/7', 0)
    expect(rs.tableData).toMatchSnapshot()
  })

  test('#clearCellData', () => {
    rs.setCellData('B-2', '=A1+3', 3)
    expect(rs.getCellResult('B-2')).toBe(3)

    rs.clearCellData('B-2')
    expect(rs.getCellResult('B-2')).toBeUndefined()
  })
})
