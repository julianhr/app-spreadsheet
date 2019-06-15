import { configureStore } from 'redux-starter-kit'

import globalReducer from './globalReducer'
import tableDataReducer from './tableDataReducer'
import tableMetaReducer from './tableMetaReducer'


const appStoreGen = () => (
  configureStore({
    reducer: {
      global: globalReducer,
      tableData: tableDataReducer,
      tableMeta: tableMetaReducer,
    }
  })
)

const appStore = appStoreGen()


export default appStore
export { appStoreGen }
