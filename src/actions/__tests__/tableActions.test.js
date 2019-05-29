import appStoreGen from '~/reducers/'
import * as actions from '~/actions/tableActions'


describe('tableActions', () => {
  describe('#setCellValue', () => {
    it('sets currently active cell', async () => {
      const cell = 'B-2'
      const args = {
        location: cell,
        value: 'test value',
        formula: 'test formula'
      }
      const appStore = appStoreGen()

      expect(appStore.getState().table[cell]).toBeUndefined()
      await appStore.dispatch(actions.setCellValue(args))
      expect(appStore.getState().table[cell]).toEqual({ value: args.value, formula: args.formula })
    })
  })

  describe('#clearCellValue', () => {
    it('deletes value from store', async () => {
      const cell = 'B-2'
      const args = {
        location: cell,
        value: 'test value',
        formula: 'test formula'
      }
      const appStore = appStoreGen()

      expect(appStore.getState().table[cell]).toBeUndefined()

      appStore.dispatch(actions.setCellValue(args))
      expect(appStore.getState().table[cell]).toEqual({ value: args.value, formula: args.formula })

      await appStore.dispatch(actions.clearCellValue(cell))
      expect(appStore.getState().table[cell]).toBeUndefined()
    })

    it('dispatches action only if there is a value', async () => {
      const cell = 'B-2'
      const args = {
        location: cell,
        value: 'test value',
        formula: 'test formula'
      }
      const appStore = appStoreGen()
      let res

      appStore.dispatch(actions.setCellValue(args))
      res = await appStore.dispatch(actions.clearCellValue(cell))
      expect(res).toBeTruthy()

      res = await appStore.dispatch(actions.clearCellValue(cell))
      expect(res).toBeFalsy()
    })
  })
})
