import { parseLocation, getColumnLabel } from '~/library/utils'


class KeyboardFocuser {
  constructor(component) {
    this.c = component
  }

  run() {
    const { location } = this.c.props
    let elQry

    if (this.c.state.isFuncSelectorVisible) {
      elQry = this.funcSelectorElQry(location)
    } else {
      elQry = this.defaultElQry(location)
    }

    this.focusElement(elQry)
  }

  funcSelectorElQry(location) {
    const { key } = this.c.state.keyEvent

    if (key === 'Escape') {
      return this.resultCellQry(location)
    }
  }

  defaultElQry(location) {
    const { key, shiftKey } = this.c.state.keyEvent

    if (key === 'Escape') {
      return this.resultCellQry(location)
    } else if (key === 'Tab' && shiftKey) {
      return this.left(location)
    } else if (key === 'Tab') {
      return this.right(location)
    } else if (key === 'Enter') {
      return this.down(location)
    }
  }

  left(location) {
    const [colIndex, rowIndex] = parseLocation(location)
    const nextColIndex = Math.max(0, colIndex - 1)
    const colLabel = getColumnLabel(nextColIndex)
    const rowLabel = '' + (rowIndex + 1)
    const endLocation = `${colLabel}-${rowLabel}`
    return this.resultCellQry(endLocation)
  }

  right(location) {
    const [colIndex, rowIndex] = parseLocation(location)
    const nextColIndex = Math.min(this.c.props.columns - 1, colIndex + 1)
    const colLabel = getColumnLabel(nextColIndex)
    const rowLabel = '' + (rowIndex + 1)
    const endLocation = `${colLabel}-${rowLabel}`
    return this.resultCellQry(endLocation)
  }

  down(location) {
    const [colIndex, rowIndex] = parseLocation(location)
    const nextRowIndex = Math.min(this.c.props.rows - 1, rowIndex + 1)
    const colLabel = getColumnLabel(colIndex)
    const rowLabel = '' + (nextRowIndex + 1)
    const endLocation = `${colLabel}-${rowLabel}`
    return this.resultCellQry(endLocation)
  }

  resultCellQry(location) {
    return `[data-cell="result"][data-location="${location}"]`
  }

  focusElement(elQry) {
    if (!elQry) { return }
    const el = document.querySelector(elQry)
    el.focus()
  }
}

export default KeyboardFocuser
