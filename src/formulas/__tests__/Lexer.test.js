import { Lexer, TOKENS as t } from '../Lexer'


const toBeWithMsg = {
  toBeWithMsg: (received, expected) => {
    const pass = received.result === expected

    return {
      pass,
      message: () => `context: "${received.context}", expected: ${expected}`
    }
  }
}

describe('Lexer', () => {
  describe('#consume', () => {
    it('increases index if index < input length and sets char', () => {
      const lexer = new Lexer('test')
      lexer.consume()
      expect(lexer.index).toBe(1)
      expect(lexer.char).toBe('e')
    })

    it('sets EOF if index reaches end of input', () => {
      const lexer = new Lexer('hi')
      lexer.consume()
      lexer.consume()
      expect(lexer.index).toBe(2)
      expect(lexer.char).toBe(t.EOF)

      lexer.consume()
      expect(lexer.index).toBe(3)
      expect(lexer.char).toBe(t.EOF)
    })
  })

  test('#isEOF', () => {
    let input, lexer

    input = '=5'
    lexer = new Lexer(input)
    expect(lexer.isEOF()).toBe(false)
    Array(2).fill('').forEach( _ => lexer.consume() ) // consume all tokens
    expect(lexer.isEOF()).toBe(true)
    lexer.nextToken()
    expect(lexer.isEOF()).toBe(true)
    
    input = '1000'
    lexer = new Lexer(input)
    Array(1).fill('').forEach( _ => lexer.nextToken() ) // consume all tokens
    expect(lexer.nextToken().type).toBe(t.EOF)
    expect(lexer.isEOF()).toBe(true)
  })

  test('#isWhitespace', () => {
    const input = '=5 + 10 '
    const lexer = new Lexer(input)
    const cases = [
      false, // =
      false, // 5
      true, // ' '
      false, // +
      true, // ' '
      false, // 1
      false, // 0
      true, // ' '
      false, // EOF
    ]

    expect.extend(toBeWithMsg)

    for (let expected of cases) {
      const received = {
        context: lexer.char,
        result: lexer.isWhitespace(),
      }

      expect(received).toBeWithMsg(expected)
      lexer.consume()
    }
  })

  test('#isSeparator', () => {
    const input = '=5+(8)+P4/3-8*7 +suM(4)'
    const lexer = new Lexer(input)
    const cases = [
      false, // =
      false, // 5
      true, // +
      true, // (
      false, // 8
      true, // )
      true, // +
      false, // P
      false, // 4
      true, // /
      false, // 3
      true, // -
      false, // 8
      true, // *
      false, // 7
      false, // ' '
      true, // +
      false, // s
      false, // u
      false, // M
      true, // (
      false, // 4
      true, // )
      false, // EOF
    ]

    expect.extend(toBeWithMsg)

    for (let expected of cases) {
      const received = {
        context: lexer.char,
        result: lexer.isSeparator(),
      }

      expect(received).toBeWithMsg(expected)
      lexer.consume()
    }
  })

  test('#getWhitespaceLen', () => {
    const input = '= 5  +10 '
    const lexer = new Lexer(input)

    lexer.consume()
    expect(lexer.getWhitespaceLen()).toBe(1)
    lexer.consume()
    expect(lexer.getWhitespaceLen()).toBe(2)
    lexer.consume()
    expect(lexer.getWhitespaceLen()).toBe(0)
  })

  test('token EOF', () => {
    const input = '=5'
    const lexer = new Lexer(input)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // consume all tokens
    expect(lexer.nextToken().type).toBe(t.EOF)
    expect(lexer.nextToken().type).toBe(t.EOF)
  })

  test('token UNKNOWN', () => {
    const input = '=ñu /( ?invalid)'
    const lexer = new Lexer(input)
    let token

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // consume all tokens
    token = lexer.nextToken()
    expect(token.type).toBe(t.UNKNOWN)
    
    Array(2).fill('').forEach(_ => lexer.nextToken() ) // consume all tokens
    token = lexer.nextToken()
    expect(token.type).toBe(t.UNKNOWN)
  })

  describe('token TEXT', () => {
    it('matches snapshot', () => {
      const input = 'test input'
      const lexer = new Lexer(input)
      const tokens = lexer.getTokens()

      expect(tokens.length).toBe(1)
      expect(tokens[0]).toMatchSnapshot()
    })

    it('identifies as text anything that does not start with an equal sign', () => {
      const cases = [
        '  ',
        '.',
        'hi',
        ' hi  ',
        '+1',
        ' 1',
        ' =2',
        ' =2+3',
      ]
  
      for (let input of cases) {
        const lexer = new Lexer(input)
        const tokens = lexer.getTokens()
  
        expect(tokens.length).toBe(1)
        expect(tokens[0].type).toBe(t.TEXT)
      }
    })

    it('identifies as text tokens that fail initial designation', () => {
      const cases = [
        ['=summ(5)', 1],
        ['=5+.2.', 3],
        ['=2.3.2+5', 1],
      ]
  
      for (let [input, index] of cases) {
        const lexer = new Lexer(input)
        const tokens = lexer.getTokens()
  
        expect(tokens[index].type).toBe(t.TEXT)
      }
    })
  })

  test('token EQUALS', () => {
    const cases = [
      '=5+8',
      '= 5 +8 ',
    ]

    cases.forEach(input => {
      let lexer = new Lexer(input)
      const token = lexer.nextToken()
      expect(token.type).toBe(t.EQUALS)
    })
  })

  test('token COMMA', () => {
    let token
    const input = '=SUM(5  ,6 ,7,8)'
    const lexer = new Lexer(input)

    Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.COMMA)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.COMMA)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.COMMA)
  })

  test('token LPAREN', () => {
    let token
    const input = '=SUM(5) + (6+  (7))'
    const lexer = new Lexer(input)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.LPAREN)

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.LPAREN)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.LPAREN)
  })

  test('token RPAREN', () => {
    const input = '=(5) + 8+(5  ) +8'
    const lexer = new Lexer(input)
    let token

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.RPAREN)

    Array(5).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.RPAREN)
  })

  test('token COLON', () => {
    const input = '=SUM(B2:D4)*sum(BC45  : Z5)'
    let lexer = new Lexer(input)
    let token

    Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.COLON)

    Array(6).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.COLON)
  })

  test('token PLUS', () => {
    const input = '=5+3  + 3'
    const lexer = new Lexer(input)
    let token

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.PLUS)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.PLUS)
  })

  test('token MINUS', () => {
    const input = '=5-3  - 7'
    const lexer = new Lexer(input)
    let token

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.MINUS)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.MINUS)
  })

  test('token DIV', () => {
    const input = '=5/3  / 7'
    const lexer = new Lexer(input)
    let token

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.DIV)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.DIV)
  })

  test('token MULT', () => {
    const input = '=5*3  * 8'
    const lexer = new Lexer(input)
    let token

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.MULT)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.MULT)
  })

  describe('token NUMBER', () => {
    it('returns 0 if string is empty', () => {
      const input = ''
      const lexer = new Lexer(input)
      const token = lexer.nextToken()
      expect(token.type).toBe(t.NUMBER)
    })

    it('digit value is assigned if string is a number', () => {
      const input = '47'
      const lexer = new Lexer(input)
      const tokens = lexer.getTokens()

      expect(tokens.length).toBe(1)
      expect(tokens[0].value).toBe(47)
    })

    it('parses integers', () => {
      const input = '=5. + 58 /(  23)'
      const lexer = new Lexer(input)
      const tokens = lexer.getTokens()
      let token
      let i = 0

      Array(1).fill('').forEach(_ => i++ ) // skip to token
      token = tokens[i]
      expect(token.value).toBe(5)
      
      Array(2).fill('').forEach(_ => i++ ) // skip to token
      token = tokens[i]
      expect(token.value).toBe(58)

      Array(3).fill('').forEach(_ => i++ ) // skip to token
      token = tokens[i]
      expect(token.value).toBe(23)
    })

    it('parses floats', () => {
      const input = '=58.3 /(  .23)'
      const lexer = new Lexer(input)
      const tokens = lexer.getTokens()
      let token
      let i = 0

      Array(1).fill('').forEach( _ => i++ ) // skip to token
      token = tokens[i]
      expect(token.value).toBe(58.3)

      Array(3).fill('').forEach( _ => i++ ) // skip to token
      token = tokens[i]
      expect(token.value).toBe(.23)
    })

    it('includes malformed float numbers', () => {
      const input = '=0.13.2.6+.9.+..5'
      const lexer = new Lexer(input)
      const tokens = lexer.getTokens()
      let i = 0
      let token

      Array(1).fill('').forEach(_ => i++ ) // skip to token
      token = tokens[i]
      expect(token.type).toBe(t.TEXT)

      Array(2).fill('').forEach(_ => i++ ) // skip to token
      token = tokens[i]
      expect(token.type).toBe(t.TEXT)

      Array(2).fill('').forEach(_ => i++ ) // skip to token
      token = tokens[i]
      expect(token.type).toBe(t.TEXT)
      expect(token).toMatchSnapshot()
    })
  })

  test('token CELL', () => {
    const input = '=5+B2 +  c3/(P3* cA25)'
    const lexer = new Lexer(input)
    let token

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.CELL)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.CELL)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.CELL)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.CELL)
  })

  test('token FUNCTION', () => {
    const input = '=5+SUM( sUm( 5)/  sum(5,8,9))'
    const lexer = new Lexer(input)
    let token

    Array(3).fill('').forEach(_ => lexer.nextToken()) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.FUNCTION)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.FUNCTION)

    Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expect(token.type).toBe(t.FUNCTION)
  })

  describe('#getTokens', () => {
    test('', () => {
      const input = ''
      const lexer = new Lexer(input)
      const tokens = lexer.getTokens()

      expect(tokens.length).toBe(1)
      expect(tokens[0]).toMatchSnapshot()
    })

    test('=2', () => {
      const input = '=2'
      const lexer = new Lexer(input)
      const tokens = lexer.getTokens()
      const expected = [
        t.EQUALS,
        t.NUMBER,
      ]

      expected.forEach((tokenType, i) => {
        expect(tokens[i].type).toBe(tokenType)
      })
    })

    test('=2 *  (4+5 ) ', () => {
      const input = '=2 *  (4+5 ) '
      const lexer = new Lexer(input)
      const tokens = lexer.getTokens()
      const expected = [
        t.EQUALS,
        t.NUMBER,
        t.MULT,
        t.LPAREN,
        t.NUMBER,
        t.PLUS,
        t.NUMBER,
        t.RPAREN,
      ]

      expected.forEach((tokenType, i) => {
        expect(tokens[i].type).toBe(tokenType)
      })
    })

    test('=5+ A1/(9.25.)+sum( .84.5, B2)', () => {
      const input = '=5+ A1/(9.25.)+sum( .84.5, B2)'
      const lexer = new Lexer(input)
      const expected = [
        t.EQUALS,
        t.NUMBER,
        t.PLUS,
        t.CELL,
        t.DIV,
        t.LPAREN,
        t.TEXT,
        t.RPAREN,
        t.PLUS,
        t.FUNCTION,
        t.LPAREN,
        t.TEXT,
        t.COMMA,
        t.CELL,
        t.RPAREN,
      ]
      const tokens = lexer.getTokens()

      expect(tokens.length).toEqual(expected.length)

      expected.forEach((tokenType, i) => {
        expect(tokens[i].type).toEqual(tokenType)
      })
    })
  })
})
