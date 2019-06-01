import { Lexer, GRAMMAR } from './Lexer'
import Parser from './Parser'


const ERR_DIVISION_BY_ZERO = '#DIV/0!'
const ERR_CIRCULAR_REFERENCE = '#REF!'
const ERR_GENERIC = '#ERROR!'

class Interpreter {
  constructor(location) {
    this.location = location
    this.tokens = null
    this.ast = null
    this.result = null
    this.error = null
  }

  interpret(input) {
    if (input === undefined) {
      throw new Error('Missing input argument')
    }

    try {
      const lexer = new Lexer(input, GRAMMAR)
      this.tokens = lexer.getTokens()
      const parser = new Parser(this.tokens)
      this.ast = parser.parse()
      this.result = this.visit(this.ast)
      return this.result
    } catch (error) {
      this.result = null
      this.error = error
      return this.errorResponse()
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

  visit(node) {
    switch (node._name) {
      case 'NumberNode':
        return this.NumberNode(node)
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

  NumberNode(node) {
    return node.eval()
  }

  UnaryOp(node) {
    const result = this.visit(node.expr)
    return node.eval(result)
  }

  FuncOp(node) {
    const evaluatedArgs = []

    for (let childNode of node.argNodes) {
      const result = this.visit(childNode)
      evaluatedArgs.push(result)
    }

    return node.eval(evaluatedArgs)
  }

  BinaryOp(node) {
    const left = this.visit(node.leftNode)
    const right = this.visit(node.rightNode)
    return node.eval(left, right)
  }
}

export default Interpreter
export {
  ERR_DIVISION_BY_ZERO,
  ERR_CIRCULAR_REFERENCE,
  ERR_GENERIC,
}
