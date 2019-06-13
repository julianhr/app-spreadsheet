import graph from '~/formulas/graph'
import Interpreter from '../formulas/Interpreter'


export function setCellData(location, entered) {
  const interpreter = new Interpreter(location)
  const result = interpreter.interpret(entered)


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
