import { appStoreGen } from '~/reducers/'
import * as actions from '~/actions/tableActions'


describe('tableActions', () => {
  describe('#setCellData', () => {
    it('sets currently active cell', async () => {
      const location = 'B-2'
      const entered = '5'
      const result = 5
      const appStore = appStoreGen()

      expect(appStore.getState().table[location]).toBeUndefined()
      await appStore.dispatch(actions.setCellData(location, entered))
      expect(appStore.getState().table[location]).toEqual({ entered, result })
    })
  })

  describe('#clearCellData', () => {
    it('deletes value from store', async () => {
      const location = 'B-2'
      const entered = '5'
      const result = 5
      const appStore = appStoreGen()

      expect(appStore.getState().table[location]).toBeUndefined()

      appStore.dispatch(actions.setCellData(location, entered))
      expect(appStore.getState().table[location]).toEqual({ entered, result })

      await appStore.dispatch(actions.clearCellData(location))
      expect(appStore.getState().table[location]).toBeUndefined()
    })
  })
})
