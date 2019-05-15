import { createAction } from 'redux-starter-kit'


export const setCellValue = createAction('SET_CELL_VALUE')

export function clearCellValue(location) {
  return (dispatch, getState) => {
    const value = getState().table[location]

    if (value === undefined) { return Promise.resolve() }

    let action = {
      type: 'DELETE_CELL_VALUE',
      payload: location,
    }

    return Promise.resolve(dispatch(action))
  }
}
