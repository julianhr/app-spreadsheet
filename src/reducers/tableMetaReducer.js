import { createReducer } from 'redux-starter-kit'
import { DEFAULT_COL_WIDTH } from '~/library/constants'


const INITIAL_STATE = {
  colWidths: {},
}

export default createReducer(INITIAL_STATE, {
  'SET_COL_WIDTH': (state, { payload }) => {
    const { colLabel, width } = payload
    const { colWidths } = state
    
    if (width === DEFAULT_COL_WIDTH) {
      delete state.colWidths[colLabel]
    } else {
      state.colWidths = { ...colWidths, [colLabel]: width }
    }
  },
})
