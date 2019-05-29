import { Lexer, GRAMMAR } from '../Lexer'
import Parser from '../Parser'


const toThrowWithMsg = {
  toThrowWithMsg: (received) => {
    try {
      received.func()
      return {
        pass: false,
        message: () => `received input "${received.input}" did not throw`
      }
    } catch (error) {
      return {
        pass: true,
        message: () => `received input "${received.input}" threw error`
      }
    }
  }
}

function getParser(input) {
  const lexer = new Lexer(input, GRAMMAR)
  const tokens = lexer.getTokens()
  return new Parser(tokens)
}

describe('Parser', () => {
  describe('#parse', () => {
    describe('happy path', () => {
      test('"=2"', () => {
        const input = '=2'
        const parser = getParser(input)
        const ast = parser.parse()
        expect(ast).toMatchSnapshot()
      })
  
      test('"=2+3"', () => {
        const input = '=2+3'
        const parser = getParser(input)
        const ast = parser.parse()
        expect(ast).toMatchSnapshot()
      })
  
      test('"=2+3/10+8"', () => {
        const input = '=2+3/10+8'
        const parser = getParser(input)
        const ast = parser.parse()
        expect(ast).toMatchSnapshot()
      })
  
      test('"=(2+3)*5"', () => {
        const input = '=(2+3)*5'
        const parser = getParser(input)
        const ast = parser.parse()
        expect(ast).toMatchSnapshot()
      })
  
      test('"=sum(5)"', () => {
        const input = '=sum(5)'
        const parser = getParser(input)
        const ast = parser.parse()
        expect(ast).toMatchSnapshot()
      })
  
      test('"=sum(5,6,7)"', () => {
        const input = '=sum(5,6,7)'
        const parser = getParser(input)
        const ast = parser.parse()
        expect(ast).toMatchSnapshot()
      })
  
      test('"=sum(5, SUM(7,6) ,  (10+5/7))"', () => {
        const input = '=sum(5, SUM(7,6) ,  (10+5/7))'
        const parser = getParser(input)
        const ast = parser.parse()
        expect(ast).toMatchSnapshot()
      })
    })

    describe('error path', () => {
      test('=2+', () => {
        const input = '=2+'
        const parser = getParser(input)
        expect(() => parser.parse()).toThrow('Missing factor')
      })

      test('=(2', () => {
        const input = '=(2'
        const parser = getParser(input)
        expect(() => parser.parse()).toThrow('Missing right parenthesis')
      })

      test('=sum((2,3)', () => {
        const input = '=sum((2,3)'
        const parser = getParser(input)
        expect(() => parser.parse()).toThrow('Missing right parenthesis')
      })

      test('=((2*3)', () => {
        const input = '=((2*3)'
        const parser = getParser(input)
        expect(() => parser.parse()).toThrow('Missing right parenthesis')
      })

      test('=2)', () => {
        const input = '=2)'
        const parser = getParser(input)
        expect(() => parser.parse()).toThrow(/Unexpected term/)
      })

      test('=2)+3', () => {
        const input = '=2)+3'
        const parser = getParser(input)
        expect(() => parser.parse()).toThrow(/Unexpected term/)
      })

      test('=2+)3', () => {
        const input = '=2)+3'
        const parser = getParser(input)
        expect(() => parser.parse()).toThrow(/Unexpected term/)
      })

      test('=(2+3))', () => {
        const input = '=(2+3))'
        const parser = getParser(input)
        expect(() => parser.parse()).toThrow(/Unexpected term/)
      })
    })
  })
})
