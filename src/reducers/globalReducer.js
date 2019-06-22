import { createReducer } from 'redux-starter-kit'

export const INITIAL_STATE = {
  activeCell: {},
  rows: 14,
  columns: 6,
}

export default createReducer(INITIAL_STATE, {
  'SET_ACTIVE_CELL': (state, { payload }) => {
    state.activeCell = payload
  },

  'OPEN_FLOATING_INPUTTER': (state, { payload }) => {
    state.activeCell = { ...state.activeCell, ...payload }
  },

  'CLOSE_FLOATING_INPUTTER': (state) => {
    state.activeCell.isFloatingInputterOpen = false
  },

  'SET_INPUTTER_VALUE_EVENT': (state, { payload }) => {
    state.activeCell = { ...state.activeCell, valueEvent: payload }
  },

  'RESET_INPUTTER': (state, { payload }) => {
    state.activeCell = { ...state.activeCell, ...payload }
  }
})

