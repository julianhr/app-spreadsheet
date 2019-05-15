import { createReducer } from 'redux-starter-kit'

export const INITIAL_STATE = {
  activeCell: null,
  rows: 5,
  columns: 5,
}

export default createReducer(INITIAL_STATE, {
  'SET_ACTIVE_CELL': (state, { payload }) => {
    state.activeCell = payload
  },
})
