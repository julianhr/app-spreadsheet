import { Lexer } from '../Lexer'
import Parser from '../Parser'


function getParser(input) {
  const lexer = new Lexer(input)
  const tokens = lexer.getTokens()
  return new Parser(tokens)
}

describe('Parser', () => {
  describe('#parse', () => {
    describe('happy path', () => {
      describe('strings', () => {
        test('""', () => {
          const input = ''
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
  
        test('" "', () => {
          const input = ' '
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
  
        test('"  text"', () => {
          const input = '  text'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
  
        test('"  2"', () => {
          const input = '  2'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
  
        test('"  2+"', () => {
          const input = '  2+'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
  
        test('"  2+3"', () => {
          const input = '  2+3'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
      })

      describe('arithmitic', () => {
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
  
        test('"=2+-3"', () => {
          const input = '=2+-3'
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
      })

      describe('cells', () => {
        test('"=A1"', () => {
          const input = '=A1'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
  
        test('"=A1+ B2"', () => {
          const input = '=A1+ B2'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
  
        test('"= A1 +5"', () => {
          const input = '= A1 +5'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
      })

      describe('formulas', () => {
        test('"=sum(5)"', () => {
          const input = '=sum(5)'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
  
        test('"=sum(5,6)"', () => {
          const input = '=sum(5,6,7)'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })

        test('"=sum(A1:B2, C1)"', () => {
          const input = '=sum(A1:B2, C1)'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })

        test('"=sum(B2:A1, C2:D4)"', () => {
          const input = '=sum(B2:A1, C2:D4)'
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

        test('\'=CONCAT("str1"," str2 ")\'', () => {
          const input = '=CONCAT("str1"," str2 ")'
          const parser = getParser(input)
          const ast = parser.parse()
          expect(ast).toMatchSnapshot()
        })
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
