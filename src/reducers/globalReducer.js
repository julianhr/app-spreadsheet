import { createReducer } from 'redux-starter-kit'

export const INITIAL_STATE = {
  activeCell: {},
  cellInputter: {},
  rows: 14,
  columns: 6,
}

export default createReducer(INITIAL_STATE, {
  'SET_ACTIVE_CELL': (state, { payload }) => {
    state.activeCell = payload
  },
  'OPEN_CELL_INPUTTER': (state, { payload }) => {
    state.cellInputter = payload
  },

  'CLOSE_CELL_INPUTTER': (state) => {
    state.cellInputter = { ...state.cellInputter, isCellInputterOpen: false }
  },
})
