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
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        this.c.setValueEvent(
          this.c.props.valueEvent.value,
          this.c.refInput.current.selectionEnd
        )
        break
    }
  }

  default(key) {
    switch (key) { // eslint-disable-line
      case 'Escape':
        break
      case 'Enter':
      case 'Tab':
        this.c.cellValueSetter.run()
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        this.c.setValueEvent(
          this.c.props.valueEvent.value,
          this.c.refInput.current.selectionEnd
        )
        break
    }
  }
}

export default KeyboardActions
