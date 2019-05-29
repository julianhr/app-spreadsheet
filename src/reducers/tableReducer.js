import { createReducer } from 'redux-starter-kit'


const INITIAL_STATE = {}

export default createReducer(INITIAL_STATE, {
  'SET_CELL_VALUE': (state, { payload }) => {
    const { location, value, formula } = payload
    state[location] = { value, formula }
  },

  'DELETE_CELL_VALUE': (state, { payload }) => {
    delete state[payload]
  }
})
