import { TOKENS as t } from './Lexer'
import { TextNode, NumberNode, CellNode, BinaryOp, UnaryOp, FuncOp } from './ast'


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

  func() {
    if (this.peekType() !== t.FUNCTION) {
      throw new Error('Missing function')
    }

    const func = this.curr
    this.consume()
    this.lparen()
    const args = this.args()
    this.rparen()
    return new FuncOp(func, args)
  }

  args() {
    const args = []
    let term = this.term()

    args.push(term)

    while (this.peekType() === t.COMMA) {
      this.consume()
      term = this.term()
      args.push(term)
    }

    return args
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

  peekType() {
    return this.curr && this.curr.type
  }
}

export default Parser
