import { createAction } from 'redux-starter-kit'


export const setCellValue = createAction('SET_CELL_VALUE')

export function clearCellValue(location) {
  return (dispatch, getState) => {
    const value = getState().table[location]

    if (value !== undefined) {
      dispatch({
        type: 'DELETE_CELL_VALUE',
        payload: location
      })
    }
  }
}
