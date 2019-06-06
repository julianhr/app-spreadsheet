import { createReducer } from 'redux-starter-kit'


const INITIAL_STATE = {}

export default createReducer(INITIAL_STATE, {
  'SET_CELL_DATA': (state, { payload }) => {
    const { location, data } = payload
    state[location] = data
  },

  'DELETE_CELL_DATA': (state, { payload }) => {
    delete state[payload]
  }
})
