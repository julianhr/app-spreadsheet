class KeyboardActions {
  constructor(component) {
    this.c = component
  }

  run() {
    const { key } = this.c.state.keyEvent

    if (this.c.state.isFuncSelectorVisible) {
      this.funcSelector(key)
    } else {
      this.default(key)
    }
  }

  funcSelector(key) {
    switch (key) { // eslint-disable-line
      case 'Escape':
        this.c.props.closeCellInputter()
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        this.c.setState({ cursorPos: this.refInput.current.selectionEnd })
    }
  }

  default(key) {
    switch (key) { // eslint-disable-line
      case 'Escape':
        this.c.props.closeCellInputter()
        break
      case 'Enter':
        this.c.setCellValue()
        this.c.props.closeCellInputter()
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        this.c.setState({ cursorPos: this.c.refInput.current.selectionEnd })
    }
  }
}

export default KeyboardActions
