import Command from './Command'


class AddFormulaCommand extends Command {
  constructor(addFormula) {
    super()
    this.addFormula = addFormula
  }

  undo() {
    this.addFormula.unexecute()
  }

  redo() {
    this.addFormula.execute()
  }
}

export default AddFormulaCommand
