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
    let newEntered = willReplaceValue
      ? ''
      : getState().global.activeCell.entered

    return Promise.resolve(dispatch({
      type: 'OPEN_CELL_INPUTTER',
      payload: {
        isCellInputterOpen: true,
        newEntered,
        cellRect,
      }
    }))
  }
}

export const closeCellInputter = createAction('CLOSE_CELL_INPUTTER')
export const setInputterValueEvent = createAction('SET_INPUTTER_VALUE_EVENT')
