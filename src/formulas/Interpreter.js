import { Lexer, GRAMMAR } from './Lexer'
import Parser from './Parser'


class Interpreter {
  constructor(input) {
    this.input = input
    this.tokens = null
    this.ast = null
    this.result = null
    this.error = null
  }

  interpret() {
    try {
      const lexer = new Lexer(this.input, GRAMMAR)
      this.tokens = lexer.getTokens()
      const parser = new Parser(this.tokens)
      this.ast = parser.parse()
      this.result = this.visit(this.ast)
      return this.result
    } catch (error) {
      this.result = null
      this.error = error
      return null
    }
  }

  visit(node) {
    switch (node.constructor.name) {
      case 'NumberNode':
        return this.NumberNode(node)
      case 'FuncOp':
        return this.FuncOp(node)
      case 'BinaryOp':
        return this.BinaryOp(node)
      case 'UnaryOp':
          return this.UnaryOp(node)
      default:
        throw new Error(`Unrecognized AST node ${node.constructor.name}`)
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
