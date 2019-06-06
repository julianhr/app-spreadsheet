import { configureStore } from 'redux-starter-kit'

import globalReducer from './globalReducer'
import tableReducer from './tableReducer'


const appStoreGen = () => (
  configureStore({
    reducer: {
      global: globalReducer,
      table: tableReducer,
    }
  })
)

const appStore = appStoreGen()


export default appStore
export { appStoreGen }
