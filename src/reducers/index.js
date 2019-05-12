import { configureStore } from 'redux-starter-kit'

import globalReducer from './globalReducer'
import tableReducer from './tableReducer'


const appStoreFn = () => (
  configureStore({
    reducer: {
      global: globalReducer,
      table: tableReducer,
    }
  })
)


export default appStoreFn
