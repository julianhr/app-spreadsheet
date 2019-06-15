import { createReducer } from 'redux-starter-kit'

const INITIAL_STATE = {
  colWidths: {},
  rowHeights: {},
}

export default createReducer(INITIAL_STATE, {

  'SET_COL_WIDTH': (state, { payload }) => {
    const { colLabel, width } = payload
    const { colWidths } = state
    state.colWidths = { ...colWidths, [colLabel]: width }
  },

  'SET_ROW_HEIGHT': (state, { payload }) => {
    const { rowLabel, height } = payload
    const { rowHeights } = state
    state.rowHeights = { ...rowHeights, [rowLabel]: height }
  },

})
