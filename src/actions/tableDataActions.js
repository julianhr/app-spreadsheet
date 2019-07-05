export function setCellData(location, entered, result) {
  return {
    type: 'SET_CELL_DATA',
    payload: { location, data: { entered, result } },
  }
}

export function clearCellData(location) {
  return (dispatch, getState) => {
    const value = getState().tableData[location]

    if (value === undefined) {
      return Promise.resolve()
    }

    return Promise.resolve(dispatch({
      type: 'DELETE_CELL_DATA',
      payload: location,
    }))
  }
}
