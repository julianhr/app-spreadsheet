class KeyboardActions {
  constructor(component) {
    this.c = component
  }

  run() {
    const { key } = this.c.state.keyEvent

    if (key === 'Escape') {
      this.c.props.resetInputterValueEvent()
      this.c.props.onEscape()
    } else if (['ArrowLeft', 'ArrowRight'].includes(key)) {
      this.c.props.setInputterValueEvent(
        this.c.props.valueEvent.value,
        this.c.refInput.current.selectionEnd
      )
    }
  }
}

export default KeyboardActions
