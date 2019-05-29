import { TOKENS as t } from './Lexer'
import { BinaryOp, FuncOp, NumberNode } from './ast'


class Parser {
  constructor(tokens) {
    this.index = 0
    this.tokens = tokens
    this.curr = tokens[this.index]
    this.depth = 0
  }

  parse() {
    this.equals()
    const root = this.expr()

    if (this.curr !== null) {
      throw new Error(`Unexpected term at index ${this.index}: "${this.curr.text}"`)
    }

    if (this.depth !== 0) {
      throw new Error('Unbalanced expression')
    }

    return root
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
    // factor : NUMBER | LPAREN expr RPAREN | FUNCTION LPAREN list RPAREN
    switch (this.peekType()) {
      case t.NUMBER:
        return this.number()
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

  func() {
    let func, args

    if (this.peekType() === t.FUNCTION) {
      func = this.curr
      this.consume()
      this.lparen()
      args = this.args()
      this.rparen()
      return new FuncOp(func, args)
    } else {
      throw new Error('Missing function')
    }
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
    if (this.peekType() === t.EQUALS) {
      this.consume()
    } else {
      throw new Error('Missing equals sign')
    }
  }

  lparen() {
    if (this.peekType() === t.LPAREN) {
      this.depth += 1
      this.consume()
    } else {
      throw new Error('Missing left parenthesis')
    }
  }

  rparen() {
    if (this.peekType() === t.RPAREN) {
      this.depth -= 1
      this.consume()
    } else {
      throw new Error('Missing right parenthesis')
    }
  }

  consume() {
    if (this.index < this.tokens.length - 1) {
      this.index++
      this.curr = this.tokens[this.index]
    } else {
      this.curr = null
    }
  }

  isUnbalanced() {
    return !(this.index === this.tokens.length && this.depth === 0)
  }

  peekType() {
    return this.curr && this.curr.type
  }
}

export default Parser