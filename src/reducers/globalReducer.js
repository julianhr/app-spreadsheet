import { createReducer } from 'redux-starter-kit'

export const INITIAL_STATE = {
  activeCell: {
    entered: '',
    location: '',
  },
  inputter: {
    valueEvent: {
      value: '',
      cursorPos: 0,
    }
  },
  scheduledFloatingInputter: {
    willOpen: false,
    isInteractive: false,
  },
  floatingInputter: {
    cellRect: {},
    isOpen: false,
    isInteractive: false,
  },
  rows: 14,
  columns: 6,
}

export default createReducer(INITIAL_STATE, {
  'SET_TABLE_DIMENSIONS': (state, { payload }) => {
    state.rows = payload.rows
    state.columns = payload.columns
  },
  
  'SET_ACTIVE_CELL': (state, { payload }) => {
    state.activeCell = payload
  },

  'SCHEDULE_FLOATING_INPUTTER': (state, { payload }) => {
    const { isInteractive } = payload

    state.scheduledFloatingInputter = {
      willOpen: true,
      isInteractive,
    }
  },

  'UNSCHEDULE_FLOATING_INPUTTER': (state) => {
    state.scheduledFloatingInputter = {
      willOpen: false,
      isInteractive: false,
    }
  },

  'OPEN_FLOATING_INPUTTER': (state, { payload }) => {
    state.floatingInputter = { ...state.floatingInputter, ...payload }
  },

  'SET_FLOATING_INPUTTER_INTERACTIVE': (state, { payload }) => {
    state.floatingInputter = { ...state.floatingInputter, isInteractive: payload }
  },

  'CLOSE_FLOATING_INPUTTER': (state) => {
    state.floatingInputter.isOpen = false
  },

  'SET_INPUTTER_VALUE_EVENT': (state, { payload }) => {
    state.inputter.valueEvent = payload
  },

  'RESET_FLOATING_INPUTTER': (state, { payload }) => {
    state.floatingInputter = { ...state.floatingInputter, ...payload }
  },
})

