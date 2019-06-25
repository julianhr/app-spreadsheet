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

export function setInputterValueEvent(value, cursorPos) {
  return {
    type: 'SET_INPUTTER_VALUE_EVENT',
    payload: {
      value,
      cursorPos: cursorPos === undefined
        ? value.length
        : cursorPos
    }
  }
}

export function setActiveCell(location) {
  return (dispatch, getState) => {
    const cellData = getState().tableData[location]
    const entered = (cellData || {}).entered || ''

    dispatch(setInputterValueEvent(entered, entered.length))

    return Promise.resolve(
      dispatch({
        type: 'SET_ACTIVE_CELL',
        payload: {
          entered,
          location,
        }
      })
    )
  }
}

export function setFloatingInputterInteractive(isInteractive) {
  return {
    type: 'SET_FLOATING_INPUTTER_INTERACTIVE',
    payload: isInteractive
  }
}

export function openFloatingInputter(cellRect, willReplaceValue, isInteractive) {
  return (dispatch, getState) => {
    const state = getState()
    const value = willReplaceValue ? '' : state.global.activeCell.entered

    dispatch(setInputterValueEvent(value))

    return Promise.resolve(
      dispatch({
        type: 'OPEN_FLOATING_INPUTTER',
        payload: {
          cellRect,
          isOpen: true,
          isInteractive,
          willOpen: false,
        }
      })
    )
  }
}

export function resetInputterValueEvent() {
  return (dispatch, getState) => {
    const location = getState().global.activeCell.location
    const cellData = getState().tableData[location]
    const entered = (cellData || {}).entered || ''

    dispatch(setInputterValueEvent(entered))
  }
}

export function scheduleFloatingInputter(isInteractive) {
  return (dispatch, getState) => {
    const { floatingInputter } = getState().global

    if (floatingInputter.isOpen && floatingInputter.isInteractive === isInteractive) {
      return
    }

    return Promise.resolve(
      dispatch({
        type: 'SCHEDULE_FLOATING_INPUTTER',
        payload: {
          isInteractive
        },
      })
    )
  }
}

export function unscheduleFloatingInputter() {
  return {
    type: 'UNSCHEDULE_FLOATING_INPUTTER',
    payload: null,
  }
}

export const closeFloatingInputter = createAction('CLOSE_FLOATING_INPUTTER')
