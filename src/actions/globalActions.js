import { createAction } from 'redux-starter-kit'


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

export function resetInputter(initValueEvent) {
  return {
    type: 'RESET_INPUTTER',
    payload: {
      isFloatingInputterOpen: false,
      valueEvent: initValueEvent
    }
  }
}

export const closeFloatingInputter = createAction('CLOSE_FLOATING_INPUTTER')
export const setInputterValueEvent = createAction('SET_INPUTTER_VALUE_EVENT')
