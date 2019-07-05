import Command from './Command'


class ClearFormulaCommand extends Command {
  constructor(clearFormula) {
    super()
    this.clearFormula = clearFormula
  }

  undo() {
    this.clearFormula.unexecute()
  }

  redo() {
    this.clearFormula.execute()
  }
}

export default ClearFormulaCommand
