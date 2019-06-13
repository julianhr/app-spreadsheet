import { TOKENS as t } from './Lexer'
import {
  TextNode,
  NumberNode,
  CellNode,
  CellRange,
  BinaryOp,
  UnaryOp,
  FuncOp
} from './ast'


class Parser {
  constructor(tokens) {
    this.index = 0
    this.tokens = tokens
    this.curr = this.tokens[0]
    this.ast = null
  }

  parse() {
    switch (this.peekType()) {
      case t.TEXT:
        this.ast = this.text()
        break
      case t.NUMBER:
        this.ast = this.number()
        break
      default:
        this.equals()
        this.ast = this.expr()
        break
    }

    if (this.curr !== null) {
      throw new Error(`Unexpected term at index ${this.index}: "${this.curr.text}"`)
    }

    return this.ast
  }

  expr() {
    // expr : term ( ( PLUS | MINUS ) term ) *
    let node, operator, right

    node = this.term()

    while ( [t.PLUS, t.MINUS].includes(this.peekType()) ) {
      operator = this.operator()
      right = this.term()
      node = new BinaryOp(node, operator, right)
    }

    return node
  }

  term() {
    // term : factor ( ( MULT | DIV ) factor ) *
    let node, operator, right

    node = this.factor()

    while ( [t.MULT, t.DIV].includes(this.peekType()) ) {
      operator = this.operator()
      right = this.factor()
      node = new BinaryOp(node, operator, right)
    }

    return node
  }

  factor() {
    // factor : ( PLUS | MINUS ) ( NUMBER | CELL )
    //          | LPAREN expr RPAREN
    //          | FUNCTION LPAREN list RPAREN
    switch (this.peekType()) {
      case t.PLUS:
      case t.MINUS:
        return this.unaryOp()
      case t.NUMBER:
        return this.number()
      case t.CELL:
        return this.cell()
      case t.LPAREN:
        return this.enclosedExpr()
      case t.FUNCTION:
        return this.func()
      case t.RPAREN:
        throw new Error(`Unexpected term at index ${this.index}: "${this.curr.text}"`)
      default:
        throw new Error('Missing factor')
    }
  }

  text() {
    let node

    if (this.peekType() !== t.TEXT) {
      throw new Error('Missing string')
    }

    node = new TextNode(this.curr)
    this.consume()
    return node
  }

  number() {
    if (this.peekType() === t.NUMBER) {
      const node = new NumberNode(this.curr)
      this.consume()
      return node
    } else {
      throw new Error('Missing number')
    }
  }

  operator() {
    if ([t.PLUS, t.MINUS, t.MULT, t.DIV].includes(this.peekType())) {
      const node = this.curr
      this.consume()
      return node
    } else {
      throw new Error('Missing operator')
    }
  }

  enclosedExpr() {
    this.lparen()
    const node = this.expr()
    this.rparen()
    return node
  }

  cell() {
    if (this.peekType() !== t.CELL) {
      throw new Error('Missing cell node')
    }

    const node = new CellNode(this.curr)
    this.consume()
    return node
  }

  isCellRange() {
    return (
      this.peekType(0) === t.CELL
      && this.peekType(1) === t.COLON
      && this.peekType(2) === t.CELL
    )
  }

  cellRange() {
    let left, right

    if (!this.isCellRange()) {
      throw new Error('Missing cell range')
    }

    left = new CellNode(this.curr)
    this.consume() // skip colon
    this.consume()
    right = new CellNode(this.curr)
    this.consume()

    if (right.location < left.location) {
      [left, right] = this.invertCellRange(left, right)
    }

    return new CellRange(left, right)
  }

  invertCellRange(left, right) {
    this.tokens[this.index - 2] = right.cell
    this.tokens[this.index] = left.cell
    let temp = left
    left = right
    right = temp
    return [left, right]
  }

  func() {
    if (this.peekType() !== t.FUNCTION) {
      throw new Error('Missing function')
    }

    const func = this.curr
    this.consume()
    this.lparen()
    const args = this.list()
    this.rparen()
    return new FuncOp(func, args)
  }

  list() {
    const list = []
    let node

    node = this.getListNode()
    list.push(node)

    while (this.peekType() === t.COMMA) {
      this.consume() // skip comma token
      node = this.getListNode()
      list.push(node)
    }

    return list
  }

  getListNode() {
    if (this.isCellRange()) {
      return this.cellRange()
    } else {
      return this.expr()
    }
  }

  equals() {
    if (this.peekType() !== t.EQUALS) {
      throw new Error('Missing equals sign')
    }

    this.consume()
  }

  lparen() {
    if (this.peekType() !== t.LPAREN) {
      throw new Error('Missing left parenthesis')
    }

    this.consume()
  }

  rparen() {
    if (this.peekType() !== t.RPAREN) {
      throw new Error('Missing right parenthesis')
    }

    this.consume()
  }

  unaryOp() {
    if (![t.PLUS, t.MINUS].includes(this.peekType())) {
      throw new Error('Missing unary operator')
    }

    const curr = this.curr
    this.consume()
    const node = new UnaryOp(curr, this.factor())
    return node
  }

  consume() {
    if (this.index < this.tokens.length - 1) {
      this.index++
      this.curr = this.tokens[this.index]
    } else {
      this.curr = null
    }
  }

  peekType(stepsAhead) {
    if (stepsAhead) {
      if (stepsAhead < 0) {
        throw new Error('peak ahead index must be positive')
      }

      const index = this.index + stepsAhead

      if (index < this.tokens.length) {
        return this.tokens[index].type
      }
    } else {
      return this.curr && this.curr.type
    }
  }
}

export default Parser
