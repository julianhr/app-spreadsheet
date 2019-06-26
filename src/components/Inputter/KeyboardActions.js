class KeyboardActions {
  constructor(component) {
    this.c = component
  }

  run() {
    const { key } = this.c.state.keyEvent

    switch (key) { // eslint-disable-line
      case 'Escape':
        this.c.props.resetInputterValueEvent()
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        this.c.props.setInputterValueEvent(
          this.c.props.valueEvent.value,
          this.c.refInput.current.selectionEnd
        )
        break
    }
  }
}

export default KeyboardActions
