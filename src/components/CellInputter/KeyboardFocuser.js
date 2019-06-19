import { parseLocation, getColumnLabel } from '~/library/utils'


class KeyboardFocuser {
  constructor(component) {
    this.c = component
  }

  run() {
    const { key } = this.c.state.keyEvent
    const { location } = this.c.props
    let elementId

    if (this.c.state.isFuncSelectorVisible) {
      elementId = this.funcSelectorElId(key, location)
    } else {
      elementId = this.defaultElId(key, location)
    }

    this.focusElement(elementId)
  }

  funcSelectorElId(key, location) {
    if (key === 'Escape') {
      return `[data-cell="result"][data-location="${location}"]`
    }
  }

  defaultElId(key, location) {
    switch (key) {
      case 'Tab':
        return `[data-cell="result"][data-location="${location}"]`
      case 'Enter':
        return this.defaultEnter(location)
      case 'Escape':
        return `[data-cell="result"][data-location="${location}"]`
      default:
        // this.c.refInput.current.focus()
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

  focusElement(id) {
    if (!id) { return }

    const el = document.querySelector(id)

    if (document.activeElement !== el) {
      el.focus()
    }
  }
}

export default KeyboardFocuser
