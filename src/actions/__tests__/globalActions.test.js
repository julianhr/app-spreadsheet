import { appStoreGen } from '~/reducers/'
import * as actions from '~/actions/globalActions'


describe('globalActions', () => {
  describe('#setActiveCell', () => {
    it('sets currently active cell', async () => {
      const value = 'B-2'
      const appStore = appStoreGen()

      expect(appStore.getState().global.activeCell).toBeNull()
      await appStore.dispatch(actions.setActiveCell(value))
      expect(appStore.getState().global.activeCell).toEqual(value)
    })
  })
})
