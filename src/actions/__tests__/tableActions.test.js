import appStoreGen from '~/reducers/'
import * as actions from '~/actions/tableActions'


describe('tableActions', () => {
  describe('#setCellValue', () => {
    it('sets currently active cell', () => {
      const cell = 'B-2'
      const value = {
        location: cell,
        text: 'test text',
        formula: 'test formula'
      }
      const appStore = appStoreGen()

      expect(appStore.getState().table[cell]).toBeUndefined()
      appStore.dispatch(actions.setCellValue(value))
      expect(appStore.getState().table[cell]).toEqual({ text: value.text, formula: value.formula })
    })
  })

  describe('#clearCellValue', () => {
    it.only('deletes value from store', async () => {
      const cell = 'B-2'
      const value = {
        location: cell,
        text: 'test text',
        formula: 'test formula'
      }
      const appStore = appStoreGen()

      expect(appStore.getState().table[cell]).toBeUndefined()

      appStore.dispatch(actions.setCellValue(value))
      expect(appStore.getState().table[cell]).toEqual({ text: value.text, formula: value.formula })

      await appStore.dispatch(actions.clearCellValue(cell))
      expect(appStore.getState().table[cell]).toBeUndefined()
    })

    it('dispatches action only if there is a value', async () => {
      const cell = 'B-2'
      const value = {
        location: cell,
        text: 'test text',
        formula: 'test formula'
      }
      const appStore = appStoreGen()
      let res

      appStore.dispatch(actions.setCellValue(value))
      res = await appStore.dispatch(actions.clearCellValue(cell))
      expect(res).toBeTruthy()

      res = await appStore.dispatch(actions.clearCellValue(cell))
      expect(res).toBeFalsy()
    })
  })
})
