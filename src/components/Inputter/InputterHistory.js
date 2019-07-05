import { debounce } from '~/library/utils'


class InputterHistory {
  constructor(component, maxUndo, wait) {
    this.c = component
    this.maxUndo = maxUndo
    this.history = []
    this.index = 0
    this.lastUndo = null
    this.push = debounce(this.pushValueEvent.bind(this), wait, false)
    this.push.bind(this)
  }

  reset() {
    const { entered, valueEvent } = this.c.props
    this.history.length = 0

    if (entered !== valueEvent.value) {
      this.history.push({ value: entered, cursorPos: entered.length })
    }

    this.index = 0
    this.lastUndo = null
  }

  keyAction() {
    const { key, metaKey, ctrlKey, shiftKey } = this.c.state.keyEvent

    if (key === 'z' && shiftKey && (metaKey || ctrlKey)) {
      this.redo()
    } else if (key === 'z' && (metaKey || ctrlKey)) {
      this.undo()
    }
  }

  pushValueEvent(valueEvent) {
    if (!this.c.props.isInteractive) { return }
    if (this.isValueRepeated(valueEvent)) { return }
    this.truncateHistory()
    this.history.push(valueEvent)
    this.index = this.history.length - 1
    this.lastUndo = null
  }


  undo() {
    const index = Math.max(0, this.index - 1)
    this.setInputterValueEvent(index)
  }

  redo() {
    const index = Math.min(this.history.length - 1, this.index + 1)
    this.setInputterValueEvent(index)
  }

  isValueRepeated(valueEvent) {
    const { value } = valueEvent

    if (this.lastUndo && this.lastUndo.value === value) {
      return true
    } else if (this.history.length > 0) {
      const index = this.history.length - 1
      return this.history[index].value === value
    }

    return false
  }

  truncateHistory() {
    while (this.index < this.history.length - 1) {
      this.history.pop()
    }

    if (this.history.length === this.maxUndo) {
      this.history.shift()
    }
  }

  setInputterValueEvent(index) {
    if (index !== this.index) {
      const event = this.history[index]
      this.index = index
      this.lastUndo = event
      this.c.props.setInputterValueEvent(event.value, event.cursorPos)
    }
  }
}

export default InputterHistory
