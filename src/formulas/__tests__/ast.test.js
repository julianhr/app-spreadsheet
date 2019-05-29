import { NumberNode, FuncOp, BinaryOp } from '../ast'
import { TOKENS as t } from '../Lexer'
import Token from '../Token'


describe('NumberNode', () => {
  describe('#testPeriodCount', () => {
    test('125', () => {
      const token = new Token(t.NUMBER, '125')
      const node = new NumberNode(token)
      expect(() => node.testPeriodCount()).not.toThrow()
    })

    test('.25', () => {
      const token = new Token(t.NUMBER, '.25')
      const node = new NumberNode(token)
      expect(() => node.testPeriodCount()).not.toThrow()
    })

    test('0.25', () => {
      const token = new Token(t.NUMBER, '0.25')
      const node = new NumberNode(token)
      expect(() => node.testPeriodCount()).not.toThrow()
    })

    test('25.', () => {
      const token = new Token(t.NUMBER, '25.')
      const node = new NumberNode(token)
      expect(() => node.testPeriodCount()).not.toThrow()
    })

    test('.', () => {
      const token = new Token(t.NUMBER, '.')
      const node = new NumberNode(token)
      expect(() => node.testPeriodCount()).toThrow()
    })

    test('.25.', () => {
      const token = new Token(t.NUMBER, '.25.')
      const node = new NumberNode(token)
      expect(() => node.testPeriodCount()).toThrow()
    })

    test('2.5.3', () => {
      const token = new Token(t.NUMBER, '2.5.3')
      const node = new NumberNode(token)
      expect(() => node.testPeriodCount()).toThrow()
    })

    test('2.0.', () => {
      const token = new Token(t.NUMBER, '2.0.')
      const node = new NumberNode(token)
      expect(() => node.testPeriodCount()).toThrow()
    })
  })

  describe('#setTokenValue', () => {
    it('sets parsed number in token node', () => {
      const token = new Token(t.NUMBER, '5')
      const node = new NumberNode(token)
      node.setTokenValue()
      expect(node.numberNode.value).toBe(5)
    })

    it('throws error if number is invalid', () => {
      const token = new Token(t.NUMBER, '?')
      const node = new NumberNode(token)
      expect(() => node.setTokenValue()).toThrow()
    })
  })

  test('#eval', () => {
    const token = new Token(t.NUMBER, '5')
    const node = new NumberNode(token)
    jest.spyOn(node, 'testPeriodCount')
    jest.spyOn(node, 'setTokenValue')

    expect(node.eval()).toBe(5)
    expect(node.testPeriodCount).toHaveBeenCalledTimes(1)
    expect(node.setTokenValue).toHaveBeenCalledTimes(1)
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
  })
})
