import rootReducer from './rootReducer'
import { configureStore } from 'redux-starter-kit'


const appStore = configureStore({
    reducer: rootReducer
})

export default appStore
