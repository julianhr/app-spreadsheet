import appStoreGen from '~/reducers/'
import * as actions from '~/actions/tableActions'


describe('tableActions', () => {
  describe('#setCellData', () => {
    it('sets currently active cell', async () => {
      const cell = 'B-2'
      const location = cell
      const entered = 5
      const isEnteredValid = true
      const result = 5
      const appStore = appStoreGen()

      expect(appStore.getState().table[cell]).toBeUndefined()
      await appStore.dispatch(actions.setCellData(location, entered, isEnteredValid, result))
      expect(appStore.getState().table[cell]).toEqual({ entered, isEnteredValid, result })
    })
  })

  describe('#clearCellData', () => {
    it('deletes value from store', async () => {
      const cell = 'B-2'
      const location = cell
      const entered = 5
      const isEnteredValid = true
      const result = 5
      const appStore = appStoreGen()

      expect(appStore.getState().table[cell]).toBeUndefined()

      appStore.dispatch(actions.setCellData(location, entered, isEnteredValid, result))
      expect(appStore.getState().table[cell]).toEqual({ entered, isEnteredValid, result })

      await appStore.dispatch(actions.clearCellData(cell))
      expect(appStore.getState().table[cell]).toBeUndefined()
    })
  })
})
