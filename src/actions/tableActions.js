import graph from '~/formulas/graph'


export function setCellData(location, entered) {
  const result = graph.interpret(location, entered)

  return {
    type: 'SET_CELL_DATA',
    payload: { location, data: { entered, result } },
  }
}

export function replaceCellData(location, entered, result) {
  return {
    type: 'SET_CELL_DATA',
    payload: { location, data: { entered, result } },
  }
}

export function clearCellData(location) {
  return (dispatch, getState) => {
    const value = getState().table[location]

    graph.delVertex(location)

    if (value === undefined) {
      return Promise.resolve()
    }


    return Promise.resolve(dispatch({
      type: 'DELETE_CELL_DATA',
      payload: location,
    }))
  }
}
