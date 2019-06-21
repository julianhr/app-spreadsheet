import { createAction } from 'redux-starter-kit'


export function setActiveCell(location) {
  return (dispatch, getState) => {
    const cellData = getState().tableData[location]
    const entered = (cellData || {}).entered || ''

    return Promise.resolve(dispatch({
      type: 'SET_ACTIVE_CELL',
      payload: {
        location,
        entered,
      }
    }))
  }
}

export function openCellInputter(cellRect, willReplaceValue) {
  return (dispatch, getState) => {
    let valueEvent = willReplaceValue

    if (willReplaceValue) {
      valueEvent = { value: '', cursorPos: 0 }
    } else {
      const value = getState().global.activeCell.entered
      valueEvent = { value, cursorPos: value.length }
    }

    return Promise.resolve(dispatch({
      type: 'OPEN_CELL_INPUTTER',
      payload: {
        isCellInputterOpen: true,
        valueEvent,
        cellRect,
      }
    }))
  }
}

export const closeCellInputter = createAction('CLOSE_CELL_INPUTTER')
export const setInputterValueEvent = createAction('SET_INPUTTER_VALUE_EVENT')
