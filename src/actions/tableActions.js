export function setCellData(location, entered, isEnteredValid, result) {
  return {
    type: 'SET_CELL_VALUE',
    payload: {
      location,
      data: {
        entered,
        result,
        isEnteredValid,
      }
    }
  }
}

export function clearCellData(location) {
  return (dispatch, getState) => {
    const value = getState().table[location]

    if (value === undefined) { return Promise.resolve() }

    let action = {
      type: 'DELETE_CELL_DATA',
      payload: location,
    }

    return Promise.resolve(dispatch(action))
  }
}
