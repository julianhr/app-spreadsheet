class Command {
  undo() {
    throw new Error('abstract method not implemented')
  }

  redo() {
    throw new Error('abstract method not implemented')
  }
}

export default Command
