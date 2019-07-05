import { appStoreGen } from '~/reducers/'
import * as actions from '~/actions/tableDataActions'


describe('tableDataActions', () => {
  describe('#setCellData', () => {
    it("sets location's data", async () => {
      const location = 'B-2'
      const entered = '5'
      const result = 5
      const appStore = appStoreGen()

      expect(appStore.getState().tableData[location]).toBeUndefined()
      await appStore.dispatch(actions.setCellData(location, entered, result))
      expect(appStore.getState().tableData[location]).toEqual({ entered, result })
    })
  })

  describe('#clearCellData', () => {
    it('deletes value from store', async () => {
      const location = 'B-2'
      const entered = '5'
      const result = 5
      const appStore = appStoreGen()

      expect(appStore.getState().tableData[location]).toBeUndefined()

      appStore.dispatch(actions.setCellData(location, entered, result))
      expect(appStore.getState().tableData[location]).toEqual({ entered, result })

      await appStore.dispatch(actions.clearCellData(location))
      expect(appStore.getState().tableData[location]).toBeUndefined()
    })

    it("doesn't dispatch function if location doesn't exist", async () => {
      const location = 'B-2'
      const entered = '5'
      const result = 5
      const appStore = appStoreGen()
      let prevTableData
      
      appStore.dispatch(actions.setCellData(location, entered, result))
      prevTableData = appStore.getState().tableData
      await appStore.dispatch(actions.clearCellData('A-1'))
      expect(appStore.getState().tableData).toBe(prevTableData)
    })
  })
})
