import { TOKENS as t } from './Lexer'


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
    this.node = textNode
  }

  eval() {
    return this.node.text
  }
}

class StringNode extends AST {
  constructor(node) {
    super('StringNode')
    this.node = node
  }

  eval() {
    return this.node.value
  }
}

class NumberNode extends AST {
  constructor(node) {
    super('NumberNode')
    this.node = node
  }

  eval() {
    return this.node.value
  }
}

class CellNode extends AST {
  constructor(token) {
    super('CellNode')
    this.cell = token
  }

  get location() {
    return this.cell.value
  }
}

class CellRange extends AST {
  constructor(leftCell, rightCell) {
    super('CellRange')
    this.leftCell = leftCell
    this.rightCell = rightCell
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
    const fn = this.funcNode.value
    return fn(...evaluatedArgs)
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
  StringNode,
  NumberNode,
  CellNode,
  CellRange,
  BinaryOp,
  UnaryOp,
  FuncOp,
}
