import { appStoreGen } from '~/reducers/'
import * as actions from '~/actions/tableMetaActions'


describe('tableDataActions', () => {
  describe('#setColWidth', () => {
    it('sets row width', () => {
      const rowLabel = 'B'
      const width = 70
      const appStore = appStoreGen()
      
      expect(appStore.getState().tableMeta['colWidths'][rowLabel]).toBeUndefined()
      appStore.dispatch(actions.setColWidth(rowLabel, width))
      expect(appStore.getState().tableMeta['colWidths'][rowLabel]).toBe(width)
    })
  })
})
