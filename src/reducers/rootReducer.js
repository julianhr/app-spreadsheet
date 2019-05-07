import { createReducer } from 'redux-starter-kit'


const INITIAL_STATE = {
    activeCell: null,
    rows: 10,
    columns: 5,
}

export default createReducer(INITIAL_STATE, {
    'SET_ACTIVE_CELL': (state, { payload }) => {
        return { ...state, activeCell: payload }
    },
})
