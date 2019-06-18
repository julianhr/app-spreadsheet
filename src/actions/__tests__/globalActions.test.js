import { appStoreGen } from '~/reducers/'
import * as actions from '~/actions/globalActions'
import { setCellData } from '~/actions/tableDataActions'


describe('globalActions', () => {
  describe('#setActiveCell', () => {
    it('sets currently active cell', async () => {
      const location = 'B-2'
      const appStore = appStoreGen()

      expect(appStore.getState().global.activeCell).toEqual({})
      await appStore.dispatch(actions.setActiveCell(location))
      expect(appStore.getState().global.activeCell).toMatchSnapshot()
    })
  })

  describe('#displayCellInputter', () => {
    it('sets data for cell inputter', async () => {
      const location = 'B-2'
      const appStore = appStoreGen()
      const input = document.createElement('input')
      document.body.appendChild(input)
      const DOMRect = input.getBoundingClientRect()
      const inputRect = JSON.parse(JSON.stringify(DOMRect))
      document.body.removeChild(input)

      await appStore.dispatch(setCellData(location, '=5+3'))
      await appStore.dispatch(actions.setActiveCell(location))

      await appStore.dispatch(actions.openCellInputter(inputRect, false))
      expect(appStore.getState().global.cellInputter).toMatchSnapshot()

      await appStore.dispatch(actions.openCellInputter(inputRect, true))
      expect(appStore.getState().global.cellInputter).toMatchSnapshot()
    })
  })
})
