import { Lexer } from './Lexer'
import { parseLocation } from '~/library/utils'
import graph from '~/formulas/graph'
import Parser from './Parser'
import ReduxConnect from './ReduxConnect'


const ERR_DIVISION_BY_ZERO = '#DIV/0!'
const ERR_CIRCULAR_REFERENCE = '#REF!'
const ERR_GENERIC = '#ERROR!'

class Interpreter {
  constructor(location) {
    this.location = location
    this.error = null
    this.cache = {}
    this.result = null
    this.state = new ReduxConnect()
  }

  interpret(input) {
    const vertex = graph.addVertex(this.location, input)
    let lexer, parser

    try {
      lexer = new Lexer(input)
      parser = new Parser( lexer.getTokens() )
      vertex.ast = parser.parse()
      graph.recalculate(this.location)
      this.result = vertex.result
    } catch (error) {
      this.error = vertex.error = error
      this.result = vertex.result = this.errorResponse()
      return this.result
    }

    this.error = vertex.error
    return this.result
  }

  visit(location) {
    const vertex = graph.getVertex(location)

    if (graph.isResolved(location)) {
      return vertex.result
    }

    graph.markVisited(location)

    if (!vertex.ast) {
      return vertex.result
    }

    try {
      this.result = vertex.result = this._visit(vertex.ast)
    } catch (error) {
      this.error = vertex.error = error
      this.result = vertex.result = this.errorResponse()
      throw error
    }

    return this.result
  }

  _visit(node) {
    switch (node._name) {
      case 'NumberNode':
        return this.NumberNode(node)
      case 'CellNode':
        return this.CellNode(node)
      case 'TextNode':
        return this.TextNode(node)
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

  TextNode(node) {
    return node.eval()
  }

  NumberNode(node) {
    return node.eval()
  }

  CellNode(node) {
    const otherLocation = node.location
    let result

    if (!this.isLocationValid(otherLocation)) {
      throw new Error('Location out of bounds')
    }

    if (this.cache[otherLocation] !== undefined) {
      return this.cache[otherLocation]
    }

    if (graph.isVisited(otherLocation)) {
      throw new Error('Circular reference')
    }

    result = this.dfsCellVisit(otherLocation)
    this.cache[otherLocation] = result
    return result
  }

  UnaryOp(node) {
    const result = this._visit(node.expr)
    return node.eval(result)
  }

  FuncOp(node) {
    const evaluatedArgs = []

    for (let childNode of node.argNodes) {
      const result = this._visit(childNode)
      evaluatedArgs.push(result)
    }

    return node.eval(evaluatedArgs)
  }

  BinaryOp(node) {
    const left = this._visit(node.leftNode)
    const right = this._visit(node.rightNode)
    return node.eval(left, right)
  }

  isLocationValid(location) {
    const [colIndex, rowIndex] = parseLocation(location)

    if (Math.min(colIndex, rowIndex) < 0) { return false }
    if (colIndex >= this.state.columns) { return false }
    if (rowIndex >= this.state.rows) { return false }
    return true
  }

  dfsCellVisit(otherLocation) {
    const interpreter = new Interpreter(otherLocation)
    let result = 0

    // cell has a value
    if (graph.hasVertex(otherLocation)) {
      result = interpreter.visit(otherLocation)
    }

    return result
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
