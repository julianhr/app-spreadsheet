import { parseLocation, getColumnLabel } from '~/library/utils'


class KeyboardFocuser {

  constructor(component) {
    this.c = component
  }

  run() {
    const { key } = this.c.state.keyEvent
    const { location } = this.c.props
    const elementId = this.defaultElId(key, location)
    this.focusElement(elementId)
  }

  defaultElId(key, location) {
    switch (key) { // eslint-disable-line
      case 'Tab':
        return `[data-cell="result"][data-location="${location}"]`
      case 'Enter':
        return this.defaultEnter(location)
      case 'Escape':
        return `[data-cell="result"][data-location="${location}"]`
    }
  }

  defaultEnter(location) {
    const [colIndex, rowIndex] = parseLocation(location)
    const nextRowIndex = Math.min(this.c.props.rows - 1, rowIndex + 1)
    const colLabel = getColumnLabel(colIndex)
    const rowLabel = '' + (nextRowIndex + 1)
    const endLocation = `${colLabel}-${rowLabel}`

    return `[data-cell="result"][data-location="${endLocation}"]`
  }

  focusElement(elementId) {
    if (!elementId) { return }

    const el = document.querySelector(elementId)

    if (el && document.activeElement !== el) {
      el.focus()
    }
  }
}

export default KeyboardFocuser
