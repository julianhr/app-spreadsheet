import appStoreGen from '~/reducers/'
import * as actions from '~/actions/globalActions'


describe('globalActions', () => {
  describe('#setActiveCell', () => {
    it('sets currently active cell', () => {
      const value = 'B-2'
      const appStore = appStoreGen()

      expect(appStore.getState().global.activeCell).toBeNull()
      appStore.dispatch(actions.setActiveCell(value))
      expect(appStore.getState().global.activeCell).toEqual(value)
    })
  })
})
