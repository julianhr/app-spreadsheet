import { createAction } from 'redux-starter-kit'


export function setTableDimensions(rows, columns) {
  return {
    type: 'SET_TABLE_DIMENSIONS',
    payload: {
      rows,
      columns,
    }
  }
}

export function setActiveCell(location) {
  return (dispatch, getState) => {
    const cellData = getState().tableData[location]
    const entered = (cellData || {}).entered || ''

    return Promise.resolve(
      dispatch({
        type: 'SET_ACTIVE_CELL',
        payload: {
          cellRect: null,
          entered,
          isFloatingInputterOpen: false,
          location,
          valueEvent: { value: entered, cursorPos: entered.length },
        }
      })
    )
  }
}

export function openFloatingInputter(cellRect, willReplaceValue) {
  const payload = {
    cellRect,
    isFloatingInputterOpen: true,
  }

  if (willReplaceValue) {
    payload.valueEvent = { value: '', cursorPos: 0 }
  }

  return {
    type: 'OPEN_FLOATING_INPUTTER',
    payload,
  }
}

export function resetActiveCell() {
  return (dispatch, getState) => {
    const location = getState().global.activeCell.location
    const cellData = getState().tableData[location]
    const entered = (cellData || {}).entered || ''
    const payload = {
      isFloatingInputterOpen: false,
      valueEvent: { value: entered, cursorPos: entered.length },
    }

    return Promise.resolve(
      dispatch({
        type: 'RESET_INPUTTER',
        payload
      })
    )
  }
}

export const closeFloatingInputter = createAction('CLOSE_FLOATING_INPUTTER')
export const setInputterValueEvent = createAction('SET_INPUTTER_VALUE_EVENT')
