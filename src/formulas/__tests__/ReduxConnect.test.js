import graph from '../graph'
import { appStoreGen } from '~/reducers/'
import ReduxConnect from '../ReduxConnect'


describe('ReduxConnect', () => {
  let rc

  beforeEach(() => {
    rc = new ReduxConnect(appStoreGen())
  })

  test('instantiation', () => {
    expect(rc).toMatchSnapshot()
  })

  test('get #table', () => {
    rc.replaceCellData('A-1', '7', 7)
    rc.replaceCellData('B-2', '=A1+3', 10)
    expect(rc.table).toMatchSnapshot()
  })

  test('get #locations', () => {
    rc.replaceCellData('A-1', '7', 7)
    rc.replaceCellData('B-2', '=A1+3', 10)
    expect(rc.locations).toEqual(['A-1', 'B-2'])
  })

  test('#getCellResult', () => {
    rc.replaceCellData('B-2', '=A1+3', 3)
    expect(rc.getCellResult('B-2')).toBe(3)
  })

  test('#replaceCellData', () => {
    rc.replaceCellData('B-2', '=A1+3', 3)
    expect(rc.table).toMatchSnapshot()

    rc.replaceCellData('B-2', '=c5/7', 0)
    expect(rc.table).toMatchSnapshot()
  })

  test('#clearCell', () => {
    rc.replaceCellData('B-2', '=A1+3', 3)
    expect(rc.getCellResult('B-2')).toBe(3)

    rc.clearCell('B-2')
    expect(rc.getCellResult('B-2')).toBeUndefined()
  })
})
