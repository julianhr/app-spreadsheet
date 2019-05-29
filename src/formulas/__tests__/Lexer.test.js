import Token from '../Token'
import { Lexer, Rule, GRAMMAR, TOKENS as t } from '../Lexer'


const toBeWithMsg = {
  toBeWithMsg: (received, expected) => {
    const pass = received.result === expected

    return {
      pass,
      message: () => `context: "${received.context}", expected: ${expected}`
    }
  }
}

describe('Rule', () => {
  it('instantiates correctly', () => {
    const regex = /[a-z]+/gi
    const groupIndex = 0
    const token = 'TEST'
    const rule = new Rule(regex, groupIndex, token)

    expect(rule.regex).toEqual(regex)
    expect(rule.groupIndex).toEqual(groupIndex)
    expect(rule.token).toEqual(token)
  })

  it('sets regex last index', () => {
    const rule = new Rule(/[a-z]+/gi, 0, 'TEST')
    rule.setIndex(10)
    expect(rule.regex.lastIndex).toEqual(10)
  })

  it('executes regex match', () => {
    const input = '1234 test 5678'
    const rule = new Rule(/[a-z]+/gi, 0, 'TEST')
    const match = rule.test(input)
    expect(match.index).toEqual(5)
    expect(match[0]).toEqual('test')
  })
})

describe('Lexer', () => {
  describe('#consume', () => {
    it('increases index if index < input length and sets char', () => {
      const lexer = new Lexer('test', GRAMMAR)
      lexer.consume()
      expect(lexer.index).toBe(1)
      expect(lexer.char).toBe('e')
    })

    it('sets EOF if index reaches end of input', () => {
      const lexer = new Lexer('hi', GRAMMAR)
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
    const input = '=5'
    const lexer = new Lexer(input, GRAMMAR)

    expect(lexer.isEOF()).toBe(false)
    Array(2).fill('').forEach( _ => lexer.consume() ) // consume all tokens
    expect(lexer.isEOF()).toBe(true)
    lexer.nextToken()
    expect(lexer.isEOF()).toBe(true)
  })

  test('#isWhitespace', () => {
    const input = '=5 + 10 '
    const lexer = new Lexer(input, GRAMMAR)
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
    const lexer = new Lexer(input, GRAMMAR)
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

  test('#getWhitespace', () => {
    const input = '= 5  +10 '
    const lexer = new Lexer(input, GRAMMAR)

    lexer.consume()
    expect(lexer.getWhitespace()).toBe(' ')
    lexer.consume()
    expect(lexer.getWhitespace()).toBe('  ')
    lexer.consume()
    expect(lexer.getWhitespace()).toBe('')
  })

  test('token EOF', () => {
    const input = '=5'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // consume all tokens
    expected = { type: t.EOF, text: t.EOF, whitespace: '' }
    token = lexer.nextToken()
    expect(token._repr()).toEqual(expected)

    token = lexer.nextToken()
    expect(token._repr()).toEqual(expected)
  })

  test('token UNKNOWN', () => {
    const input = '=ñu /( ?invalid)'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // consume all tokens
    expected = { type: t.UNKNOWN, text: 'ñu', whitespace: '' }
    token = lexer.nextToken()
    expect(token._repr()).toEqual(expected)
    
    Array(2).fill('').forEach(_ => lexer.nextToken() ) // consume all tokens
    expected = { type: t.UNKNOWN, text: '?invalid', whitespace: ' ' }
    token = lexer.nextToken()
    expect(token._repr()).toEqual(expected)
  })

  test('token EQUALS', () => {
    const cases = [
      ['=5+8', ''],
      ['  = 5 +8 ', '  '],
    ]

    cases.forEach(([input, whitespace]) => {
      let lexer = new Lexer(input, GRAMMAR)
      const expected = { type: t.EQUALS, text: '=', whitespace }
      const token = lexer.nextToken()
      expect(token._repr()).toEqual(expected)
    })
  })

  test('token COMMA', () => {
    let token, expected
    const input = '=SUM(5  ,6 ,7,8)'
    const lexer = new Lexer(input, GRAMMAR)

    Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.COMMA, text: ',', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.COMMA, text: ',', whitespace: ' ' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.COMMA, text: ',', whitespace: '' }
    expect(token._repr()).toEqual(expected)
  })

  test('token LPAREN', () => {
    let token, expected
    const input = '=SUM(5) + (6+  (7))'
    const lexer = new Lexer(input, GRAMMAR)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.LPAREN, text: '(', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.LPAREN, text: '(', whitespace: ' ' }
    expect(token._repr()).toEqual(expected)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.LPAREN, text: '(', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token RPAREN', () => {
    const input = '=(5) + 8+(5  ) +8'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.RPAREN, text: ')', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(5).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.RPAREN, text: ')', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token COLON', () => {
    let token, expected
    const input = '=SUM(B2:D4)*sum(BC45  : Z5)'
    let lexer = new Lexer(input, GRAMMAR)

    Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.COLON, text: ':', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(6).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.COLON, text: ':', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token PLUS', () => {
    const input = '=5+3  + 3'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.PLUS, text: '+', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.PLUS, text: '+', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token MINUS', () => {
    const input = '=5-3  - 7'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.MINUS, text: '-', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.MINUS, text: '-', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token DIV', () => {
    const input = '=5/3  / 7'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.DIV, text: '/', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.DIV, text: '/', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token MULT', () => {
    const input = '=5*3  * 8'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.MULT, text: '*', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.MULT, text: '*', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  describe('token NUMBER', () => {
    it('parses integers', () => {
      const input = '=5 + 58 /(  23)'
      const lexer = new Lexer(input, GRAMMAR)
      let expected

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { type: t.NUMBER, text: '5', whitespace: '' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { type: t.NUMBER, text: '58', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { type: t.NUMBER, text: '23', whitespace: '  ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)
    })

    it('parses floats', () => {
      let expected
      const input = '=5. + 58.3 /(  .23)/ 0.13.2.6'
      const lexer = new Lexer(input, GRAMMAR)
      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { type: t.NUMBER, text: '5.', whitespace: '' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { type: t.NUMBER, text: '58.3', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { type: t.NUMBER, text: '.23', whitespace: '  ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { type: t.NUMBER, text: '0.13.2.6', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)
    })
  })

  test('token CELL', () => {
    const input = '=5+B2 +  c3/(P3* cA25)'
    const lexer = new Lexer(input, GRAMMAR)
    let expected, token

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.CELL, text: 'B2', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.CELL, text: 'c3', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.CELL, text: 'P3', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.CELL, text: 'cA25', whitespace: ' ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token FUNCTION', () => {
    const input = '=5+SUM( sUm( 5)/  sum(5,8,9))'
    const lexer = new Lexer(input, GRAMMAR)
    let expected, token

    Array(3).fill('').forEach(_ => lexer.nextToken()) // skip to token
    token = lexer.nextToken()
    expected = { type: t.FUNCTION, text: 'SUM', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.FUNCTION, text: 'sUm', whitespace: ' ' }
    expect(token._repr()).toEqual(expected)

    Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { type: t.FUNCTION, text: 'sum', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  describe('#getTokens', () => {
    test('=2', () => {
      const input = '=2'
      const lexer = new Lexer(input, GRAMMAR)
      const tokens = lexer.getTokens()
      const expected = [
        new Token(t.EQUALS, '=', ''),
        new Token(t.NUMBER, '2', ''),
      ]

      expected.forEach((token, i) => {
        expect(token._repr()).toEqual(tokens[i]._repr())
      })
    })

    test('=2 *  (4+5 )', () => {
      const input = '=2 *  (4+5 ) '
      const lexer = new Lexer(input, GRAMMAR)
      const tokens = lexer.getTokens()
      const expected = [
        new Token(t.EQUALS, '=', ''),
        new Token(t.NUMBER, '2', ''),
        new Token(t.MULT, '*', ' '),
        new Token(t.LPAREN, '(', '  '),
        new Token(t.NUMBER, '4', ''),
        new Token(t.PLUS, '+', ''),
        new Token(t.NUMBER, '5', ''),
        new Token(t.RPAREN, ')', ' '),
      ]

      expected.forEach((token, i) => {
        expect(token._repr()).toEqual(tokens[i]._repr())
      })
    })

    test('=5+P7 /  SUM(  6,7, 8) * ( 125.2 / 58.45.4)', () => {
      const input = '=5+P7 /  SUM(  6,7, 8) * ( 125.2 / 58.45.4)'
      const lexer = new Lexer(input, GRAMMAR)
      const expected = [
        new Token(t.EQUALS, '=', ''),
        new Token(t.NUMBER, '5', ''),
        new Token(t.PLUS, '+', ''),
        new Token(t.CELL, 'P7', ''),
        new Token(t.DIV, '/', ' '),
        new Token(t.FUNCTION, 'SUM', '  '),
        new Token(t.LPAREN, '(', ''),
        new Token(t.NUMBER, '6', '  '),
        new Token(t.COMMA, ',', ''),
        new Token(t.NUMBER, '7', ''),
        new Token(t.COMMA, ',', ''),
        new Token(t.NUMBER, '8', ' '),
        new Token(t.RPAREN, ')', ''),
        new Token(t.MULT, '*', ' '),
        new Token(t.LPAREN, '(', ' '),
        new Token(t.NUMBER, '125.2', ' '),
        new Token(t.DIV, '/', ' '),
        new Token(t.NUMBER, '58.45.4', ' '),
        new Token(t.RPAREN, ')', ''),
      ]
      const tokens = lexer.getTokens()
  
      expect(tokens.length).toEqual(expected.length)
  
      expected.forEach((token, i) => {
        expect(token._repr()).toEqual(tokens[i]._repr())
      })
    })
  })
})