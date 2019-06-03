import {
  TextNode,
  NumberNode,
  CellNode,
  FuncOp,
  BinaryOp,
  UnaryOp
} from '../ast'
import { TOKENS as t } from '../Lexer'
import Token from '../Token'


describe('TextNode', () => {
  test('#eval', () => {
    const input = 'testing'
    const token = new Token(t.TEXT, input)
    const node = new TextNode(token)
    expect(node.eval()).toBe(input)
  })
})

describe('NumberNode', () => {
  describe('#setTokenValue', () => {
    it('sets parsed number in token node', () => {
      const token = new Token(t.NUMBER, '5')
      const node = new NumberNode(token)
      node.setTokenValue()
      expect(node.numberNode.value).toBe(5)
    })
  })

  test('#eval happy path', () => {
    const token = new Token(t.NUMBER, '5')
    const node = new NumberNode(token)
    jest.spyOn(node, 'setTokenValue')

    expect(node.eval()).toBe(5)
    expect(node.setTokenValue).toHaveBeenCalledTimes(1)
  })

  test('#eval throws error if number is invalid', () => {
    const token = new Token(t.NUMBER, '?')
    const node = new NumberNode(token)
    expect(() => node.eval()).toThrow()
  })
})

xdescribe('CellNode', () => {
  test('#eval', () => {
    const input = 'A1'
    const token = new Token(t.CELL, input)
    const node = new CellNode(token)
    expect(node.eval()).toBe(input)
  })
})

describe('FuncOp', () => {
  describe('#getFunction', () => {
    test('valid function', () => {
      const token = new Token(t.FUNCTION, 'sum')
      const node = new FuncOp(token)
      expect(() => node.getFunction()).not.toThrow()
    })

    test('invalid function', () => {
      const token = new Token(t.FUNCTION, 'summ')
      const node = new FuncOp(token)
      expect(() => node.getFunction()).toThrow()
    })
  })

  test('#eval', () => {
    const token = new Token(t.FUNCTION, 'sum')
    const node = new FuncOp(token)
    const args = [3,7]
    jest.spyOn(node, 'getFunction')

    expect(node.eval(args)).toBe(10)
    expect(node.getFunction).toHaveBeenCalledTimes(1)
  })
})

describe('UnaryOp', () => {
  test('#eval', () => {
    let token, node

    token = new Token(t.PLUS, '+')
    node = new UnaryOp(token)
    expect(node.eval(5)).toBe(5)

    token = new Token(t.MINUS, '-')
    node = new UnaryOp(token)
    expect(node.eval(5)).toBe(-5)
  })
})

describe('BinaryOp', () => {
  describe('#eval', () => {
    test('addition', () => {
      const operator = new Token(t.PLUS, '+')
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, operator, right)
      expect(node.eval(3, 7)).toBe(10)
    })

    test('subtraction', () => {
      const operator = new Token(t.MINUS, '-')
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, operator, right)
      expect(node.eval(3, 7)).toBe(-4)
    })

    test('division', () => {
      const operator = new Token(t.DIV, '/')
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, operator, right)
      expect(node.eval(10, 5)).toBe(2)
    })

    test('division by zero', () => {
      const operator = new Token(t.DIV, '/')
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, operator, right)
      expect(() => node.eval(10, 0)).toThrow(/Division by zero/)
    })

    test('multiplication', () => {
      const operator = new Token(t.MULT, '*')
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, operator, right)
      expect(node.eval(10, 5)).toBe(50)
    })

    it('throws error if token is not recognized', () => {
      const operator = new Token(t.TEXT, 'test')
      const left = jest.fn()
      const right = jest.fn()
      const node = new BinaryOp(left, operator, right)
      expect(() => node.eval(10, 5)).toThrow()
    })
  })
})
