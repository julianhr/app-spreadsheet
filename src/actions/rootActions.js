import { createAction } from 'redux-starter-kit'


export const setActiveCell = createAction('SET_ACTIVE_CELL')

export function moveActiveCell(key) {
  return (dispatch, getState) => {
    const { activeCell, rows, columns } = getState()
    const currRow = activeCell.codePointAt(0) - 'a'.codePointAt(0)
    const currCol = Number.parseInt(activeCell[1]) - 1
    let nextRow = currRow
    let nextCol = currCol

    if (key === 'ArrowUp') { nextRow = currRow - 1 }
    else if (key === 'ArrowRight') { nextCol = currCol + 1 }
    else if (key === 'ArrowDown') { nextRow = currRow + 1 }
    else if (key === 'ArrowLeft') { nextCol = currCol - 1 }

    if (Math.min(nextRow, nextCol) >= 0 && nextRow < rows && nextCol < columns) {
      nextRow = String.fromCodePoint('a'.codePointAt(0) + nextRow)
      nextCol = nextCol + 1
      dispatch(setActiveCell(`${nextRow}${nextCol}`))
    }
  }
}
