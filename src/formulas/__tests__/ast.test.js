import {
  TextNode,
  NumberNode,
  CellNode,
  FuncOp,
  BinaryOp,
  UnaryOp
} from '../ast'
import Lexer, { TOKENS as t } from '../Lexer'


describe('TextNode', () => {
  test('#eval', () => {
    const input = 'testing'
    const lexer = new Lexer('testing')
    const tokens = lexer.getTokens()
    const token = tokens[0]
    const node = new TextNode(token)
    expect(node.eval()).toBe(input)
  })
})

describe('NumberNode', () => {
  test('#eval', () => {
    const lexer = new Lexer('=5')
    const tokens = lexer.getTokens()
    const token = tokens[1]
    const node = new NumberNode(token)
    expect(node.eval()).toBe(5)
  })

  test('get #value', () => {
    const lexer = new Lexer('=5')
    const tokens = lexer.getTokens()
    const token = tokens[1]
    const node = new NumberNode(token)
    expect(node.value).toBe(5)
  })
})

describe('CellNode', () => {
  test('get #location', () => {
    const lexer = new Lexer('=A1')
    const tokens = lexer.getTokens()
    const token = tokens[1]
    const node = new CellNode(token)
    expect(node.location).toBe('A-1')
  })
})

describe('UnaryOp', () => {
  test('#eval negative', () => {
    const lexer = new Lexer('=5-6')
    const tokens = lexer.getTokens()
    const node = new UnaryOp(tokens[2], jest.fn())
    expect(node.eval(5)).toBe(-5)
    expect(node.eval(7)).toBe(-7)
  })

  test('#eval positive', () => {
    const lexer = new Lexer('=5+6')
    const tokens = lexer.getTokens()
    const node = new UnaryOp(tokens[2], jest.fn())
    expect(node.eval(5)).toBe(5)
    expect(node.eval(7)).toBe(7)
  })
})

describe('FuncOp', () => {
  test('#eval', () => {
    const lexer = new Lexer('=sum(5)')
    const tokens = lexer.getTokens()
    const token = tokens[1]
    const node = new FuncOp(token, [])
    const args = [3,7]
    expect(node.eval(args)).toBe(10)
  })
})

describe('BinaryOp', () => {
  describe('#eval', () => {
    test('addition', () => {
      const lexer = new Lexer('=5+2')
      const tokens = lexer.getTokens()
      const opToken = tokens[2]
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, opToken, right)
      expect(node.eval(3, 7)).toBe(10)
    })

    test('subtraction', () => {
      const lexer = new Lexer('=5-2')
      const tokens = lexer.getTokens()
      const opToken = tokens[2]
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, opToken, right)
      expect(node.eval(3, 7)).toBe(-4)
    })

    test('division', () => {
      const lexer = new Lexer('=5/2')
      const tokens = lexer.getTokens()
      const opToken = tokens[2]
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, opToken, right)
      expect(node.eval(10, 5)).toBe(2)
    })

    test('division by zero', () => {
      const lexer = new Lexer('=5/0')
      const tokens = lexer.getTokens()
      const opToken = tokens[2]
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, opToken, right)
      expect(() => node.eval(10, 0)).toThrow(/Division by zero/)
    })

    test('multiplication', () => {
      const lexer = new Lexer('=5*2')
      const tokens = lexer.getTokens()
      const opToken = tokens[2]
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, opToken, right)
      expect(node.eval(10, 5)).toBe(50)
    })

    it('throws error if token is not recognized', () => {
      const lexer = new Lexer('text')
      const tokens = lexer.getTokens()
      const token = tokens[0]
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, token, right)
      expect(() => node.eval(10, 5)).toThrow()
    })
  })
})
