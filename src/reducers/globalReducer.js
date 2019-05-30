import { createReducer } from 'redux-starter-kit'

export const INITIAL_STATE = {
  activeCell: null,
  rows: 3,
  columns: 4,
}

export default createReducer(INITIAL_STATE, {
  'SET_ACTIVE_CELL': (state, { payload }) => {
    state.activeCell = payload
  },
})
