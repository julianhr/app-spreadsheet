import graph from '~/formulas/graph'
import reduxConnect from './reduxConnect'
import { debounce } from '~/library/utils'
import AddFormula from './actions/AddFormula'
import ClearFormula from './actions/ClearFormula'
import AddFormulaCommand from './commands/AddFormulaCommand'
import ClearFormulaCommand from './commands/ClearFormulaCommand'


class TableHistory {
  constructor(graph, rc=reduxConnect) {
    this.reduxConnect = rc
    this.graph = graph
    this._undo = []
    this._redo = []
  }

  push(type, ...args) {
    const command = this.getEvent(type, ...args)
    this._undo.push(command)

    if (this._redo.length > 0) {
      this._redo.length = 0
    }
  }

  getEvent(type, ...args) {
    switch (type) { // eslint-disable-line
      case 'add':
        const addFormula = new AddFormula(...args)
        return new AddFormulaCommand(addFormula)
      case 'clear':
        const clearFormula = new ClearFormula(...args)
        return new ClearFormulaCommand(clearFormula)
    }
  }

  undo() {
    if (this._undo.length > 0) {
      const command = this._undo.pop()
      this._redo.push(command)
      command.undo()
    }

    this.recalcGraph()
  }

  redo() {
    if (this._redo.length > 0) {
      const command = this._redo.pop()
      this._undo.push(command)
      command.redo()
    }

    this.recalcGraph()
  }

  recalcGraph = debounce(() => {
    const table = this.reduxConnect.getState().tableData

    graph.resetAll()

    Object.entries(table).forEach(([location, data]) => {
      const { entered } = data
      graph.addVertex(location, entered, false)
    })

    graph.recalculate()
  }, 300, false)
}

const history = new TableHistory(graph)

export default history
export { TableHistory }
