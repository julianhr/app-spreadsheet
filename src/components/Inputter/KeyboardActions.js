class KeyboardActions {
  constructor(component) {
    this.c = component
    this.disabledKeys = {}
  }

  get isFuncSelectorVisible() {
    return this.c.state.isFuncSelectorVisible 
  }

  run() {
    const { key } = this.c.state.keyEvent

    switch (key) { // eslint-disable-line
      case 'Escape':
        this.c.props.resetInputter(this.c.state.initValueEvent)
        break
      case 'Enter':
      case 'Tab':
        if (this.isFuncSelectorVisible) { return }
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
