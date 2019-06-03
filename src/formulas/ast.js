import { TOKENS as t } from './Lexer'
import formulaFn from './formulaFunctions'
import { isNumber } from '~/library/utils'


class AST {
  constructor(name) {
    this._name = name
  }

  eval() {
    throw new Error('Implement method.')
  }
}

class TextNode extends AST {
  constructor(textNode) {
    super('TextNode')
    this.textNode = textNode
  }

  eval() {
    return this.textNode.text
  }
}

class NumberNode extends AST {
  constructor(numberNode) {
    super('NumberNode')
    this.numberNode = numberNode
  }

  get value() {
    return this.numberNode.value
  }

  eval() {
    if (isNumber(this.numberNode.text)) {
      this.setTokenValue()
      return this.value
    } else {
      throw new Error(`Invalid number "${this.numberNode.text}"`)
    }
  }

  setTokenValue() {
    const value = parseFloat(this.numberNode.text)
    this.numberNode.value = value
  }
}

class CellNode extends AST {
  constructor(cell) {
    super('CellNode')
    this.cell = cell
  }

  eval() {
    throw new Error('Not yet implemented')
  }
}

class UnaryOp extends AST {
  constructor(opNode, expr) {
    super('UnaryOp')
    this.opNode = opNode
    this.expr = expr
  }

  eval(evaluatedExpr) {
    if (this.opNode.type === t.PLUS) {
      return evaluatedExpr
    } else if (this.opNode.type === t.MINUS) {
      return -evaluatedExpr
    }
  }
}

class FuncOp extends AST {
  constructor(funcNode, argNodes) {
    super('FuncOp')
    this.funcNode = funcNode
    this.argNodes = argNodes
  }

  eval(evaluatedArgs) {
    const fn = this.getFunction()
    return fn(...evaluatedArgs)
  }

  getFunction() {
    const fn = formulaFn[this.funcNode.text.toUpperCase()]

    if (!fn) {
      throw new Error(`Formula ${this.funcNode.text} not found`)
    } else {
      return fn
    }
  }
}

class BinaryOp extends AST {
  constructor(leftNode, opNode, rightNode) {
    super('BinaryOp')
    this.leftNode = leftNode
    this.opNode = opNode
    this.rightNode = rightNode
  }

  eval(left, right) {
    switch(this.opNode.type) {
      case t.PLUS:
        return left + right
      case t.MINUS:
        return left - right
      case t.DIV:
        if (right === 0) {
          throw new Error(`Division by zero: ${left}/${right}`)
        } else {
          return left / right
        }
      case t.MULT:
        return left * right
      default:
        throw new Error(`Unsupported operator "${this.token.text}"`)
    }
  }
}

export {
  TextNode,
  NumberNode,
  CellNode,
  BinaryOp,
  UnaryOp,
  FuncOp,
}
