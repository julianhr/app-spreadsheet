import { TOKENS as t } from './Lexer'
import formulaFn from './formulaFunctions'


class AST {
  eval() {
    throw new Error('Implement method.')
  }
}

class NumberNode extends AST {
  constructor(numberNode) {
    super()
    this.numberNode = numberNode
  }

  get value() {
    return this.numberNode.value
  }

  eval() {
    this.testPeriodCount()
    this.setTokenValue()
    return this.value
  }

  testPeriodCount() {
    const { text } = this.numberNode
    const periodCount = (text.match(/\./g) || []).length

    if (periodCount >= 2 || (periodCount === 1 && text.length === 1)) {
      throw new Error(`Invalid number "${this.numberNode.text}"`)
    }
  }

  setTokenValue() {
    const value = parseFloat(this.numberNode.text)

    if (isNaN(value)) {
      throw new Error(`Invalid number "${this.numberNode.text}"`)
    } else {
      this.numberNode.value = value
    }
  }
}

class FuncOp extends AST {
  constructor(funcNode, argNodes) {
    super()
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
    super()
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
  NumberNode,
  BinaryOp,
  FuncOp,
}