import { Lexer } from './Lexer'
import Parser from './Parser'
import { parseLocation } from '~/library/utils'
import ReduxConnect from './ReduxConnect'
import graph from '~/formulas/graph'


const ERR_DIVISION_BY_ZERO = '#DIV/0!'
const ERR_CIRCULAR_REFERENCE = '#REF!'
const ERR_GENERIC = '#ERROR!'

class Interpreter {
  constructor(location) {
    this.location = location
    this.inNodes = new Set()
    this.state = new ReduxConnect()
    this.tokens = null
    this.ast = null
    this.result = null
    this.error = null
    this.cache = {}
  }

  interpret(input) {
    let vertexData

    if (input === undefined) {
      throw new Error('Missing input argument')
    }

    vertexData = {
      hasError: false,
      inNodes: new Set(),
    }

    try {
      const lexer = new Lexer(input)
      this.tokens = lexer.getTokens()
      const parser = new Parser(this.tokens)
      this.ast = vertexData.ast = parser.parse()
      this.result = vertexData.result = this._visit(this.ast)
      graph.addVertex(this.location, vertexData)
    } catch (error) {
      this.result = null
      this.error = error
      vertexData.hasError = true
      graph.addVertex(this.location, vertexData)
    }

    if (this.error) {
      return this.errorResponse()
    } else {
      return this.result
    }
  }

  errorResponse() {
    const { message: errorMsg } = this.error

    if (errorMsg.match(/division by zero/i)) {
      return ERR_DIVISION_BY_ZERO
    } else if (errorMsg.match(/cirular reference/i)) {
      return ERR_CIRCULAR_REFERENCE
    } else {
      return ERR_GENERIC
    }
  }

  visit(ast) {
    this.ast = ast
    this.result = this._visit(ast)
    return this.result
  }

  _visit(node) {
    switch (node._name) {
      case 'NumberNode':
        return this.NumberNode(node)
      case 'CellNode':
        return this.CellNode(node)
      case 'FuncOp':
        return this.FuncOp(node)
      case 'BinaryOp':
        return this.BinaryOp(node)
      case 'UnaryOp':
        return this.UnaryOp(node)
      case 'TextNode':
        return this.TextNode(node)
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
    const { text: location } = node.cell
    let interpreter, ast, result

    if (location === this.location) {
      throw new Error('Circular reference')
    }

    if (!this.isLocationValid(location)) {
      throw new Error('Location out of bounds')
    }

    if (this.cache[location] !== undefined) {
      return this.cache[location]
    }

    interpreter = new Interpreter(location)
    ast = graph[location].ast
    result = interpreter.visit(ast)
    this.cache[location] = result
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
}

export default Interpreter
export {
  ERR_DIVISION_BY_ZERO,
  ERR_CIRCULAR_REFERENCE,
  ERR_GENERIC,
}
