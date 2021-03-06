import { Lexer } from './Lexer'
import { parseLocation, getColumnLabel } from '~/library/utils'
import graph from '~/formulas/graph'
import Parser from './Parser'
import ReduxStore from './ReduxStore'


const ERR_DIVISION_BY_ZERO = '#DIV/0!'
const ERR_CIRCULAR_REFERENCE = '#REF!'
const ERR_GENERIC = '#ERROR!'

class Interpreter {
  constructor(location) {
    this.location = location
    this.error = null
    this.cache = {}
    this.result = null
    this.store = new ReduxStore()
  }

  getAST(entered) {
    try {
      const lexer = new Lexer(entered)
      const parser = new Parser( lexer.getTokens() )
      const ast = parser.parse()
      return ast
    } catch (error) {
      this.error = error
      throw new Error(ERR_GENERIC)
    }
  }

  visitAST(location) {
    const vertex = graph.getVertex(location)

    if (!vertex.ast) {
      return vertex.result
    }

    try {
      this.result = vertex.result = this.visitNode(vertex.ast)
    } catch (error) {
      this.error = vertex.error = error
      this.result = vertex.result = this.errorResponse()
      throw error
    }

    return this.result
  }

  visitNode(node) {
    switch (node._name) {
      case 'NumberNode':
        return this.NumberNode(node)
      case 'CellNode':
        return this.CellNode(node)
      case 'TextNode':
        return this.TextNode(node)
      case 'StringNode':
        return this.StringNode(node)
      case 'CellRange':
        return this.CellRange(node)
      case 'FuncOp':
        return this.FuncOp(node)
      case 'BinaryOp':
        return this.BinaryOp(node)
      case 'UnaryOp':
        return this.UnaryOp(node)
      default:
        const nodeName = node._name || (node.constructor || {}).name
        throw new Error(`Unrecognized AST node ${nodeName}`)
    }
  }
  
  /* ***************************************
   * Nodes that don't require processing
   ****************************************/

  TextNode(node) {
    return node.eval()
  }

  StringNode(node) {
    return node.eval()
  }

  NumberNode(node) {
    return node.eval()
  }

  /* ***************************************
   * Nodes requiring processing
   ****************************************/

  UnaryOp(node) {
    const result = this.visitNode(node.expr)
    return node.eval(result)
  }

  CellNode(node) {
    const result = this.getCellResult(node.location)
    return result === undefined
      ? 0
      : result
  }

  BinaryOp(node) {
    const left = this.visitNode(node.leftNode)
    const right = this.visitNode(node.rightNode)

    if (typeof left !== 'number') {
      throw new Error(`term is not a number: "${left}"`)
    }

    if (typeof right !== 'number') {
      throw new Error(`term is not a number: "${right}"`)
    }

    return node.eval(left, right)
  }

  CellRange(node) {
    const [leftColIndex, leftRowIndex] = parseLocation(node.leftCell.location)
    const [rightColIndex, rightRowIndex] = parseLocation(node.rightCell.location)
    const colIndexStart = Math.min(leftColIndex, rightColIndex)
    const colIndexEnd = Math.max(leftColIndex, rightColIndex)
    const rowIndexStart = Math.min(leftRowIndex, rightRowIndex)
    const rowIndexEnd = Math.max(leftRowIndex, rightRowIndex)
    const list = []

    for (let rowI = rowIndexStart; rowI <= rowIndexEnd; rowI++) {
      for (let colI = colIndexStart; colI <= colIndexEnd; colI++) {
        const location = `${getColumnLabel(colI)}-${rowI + 1}`
        const result = this.getCellResult(location)

        if (result !== undefined) {
          list.push(result)
        }
      }
    }

    return list
  }

  getCellResult(otherLocation) {
    let result

    if (!this.isLocationValid(otherLocation)) {
      throw new Error('Location out of bounds')
    }

    if (this.cache[otherLocation] !== undefined) {
      return this.cache[otherLocation]
    }

    result = graph.visitCell(otherLocation)
    this.cache[otherLocation] = result
    return result
  }

  FuncOp(node) {
    const evaluatedArgs = []

    for (let childNode of node.argNodes) {
      const result = this.visitNode(childNode)

      if (childNode._name === 'CellRange') {
        evaluatedArgs.push(...result)
      } else {
        evaluatedArgs.push(result)
      }
    }

    return node.eval(evaluatedArgs)
  }

  isLocationValid(location) {
    const [colIndex, rowIndex] = parseLocation(location)

    if (Math.min(colIndex, rowIndex) < 0) { return false }
    if (colIndex >= this.store.columns) { return false }
    if (rowIndex >= this.store.rows) { return false }
    return true
  }

  errorResponse() {
    const { message: errorMsg } = this.error

    if (errorMsg.match(/division by zero/i)) {
      return ERR_DIVISION_BY_ZERO
    } else if (errorMsg.match(/circular reference/i)) {
      return ERR_CIRCULAR_REFERENCE
    } else {
      return ERR_GENERIC
    }
  }
}

export default Interpreter
export {
  ERR_DIVISION_BY_ZERO,
  ERR_CIRCULAR_REFERENCE,
  ERR_GENERIC,
}
