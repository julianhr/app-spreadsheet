import { createReducer } from 'redux-starter-kit'

export const INITIAL_STATE = {
  activeCell: null,
  cellInputter: null,
  rows: 14,
  columns: 6,
}

export default createReducer(INITIAL_STATE, {
  'SET_ACTIVE_CELL': (state, { payload }) => {
    state.activeCell = payload
  },
  'SET_CELL_INPUTTER': (state, { payload }) => {
    state.cellInputter = payload
  },
  'UNSET_CELL_INPUTTER': (state) => {
    state.cellInputter = null
  },
})
