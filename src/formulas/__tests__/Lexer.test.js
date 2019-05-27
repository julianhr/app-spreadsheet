import Token from '../Token'
import { Lexer, GRAMMAR, Rule } from '../Lexer'


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
      expect(lexer.char).toBe(lexer.EOF)

      lexer.consume()
      expect(lexer.index).toBe(3)
      expect(lexer.char).toBe(lexer.EOF)
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
    expected = { text: -1, value: null, type: 'EOF', whitespace: '' }
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
    expected = { text: 'ñu', value: null, type: 'UNKNOWN', whitespace: '' }
    token = lexer.nextToken()
    expect(token._repr()).toEqual(expected)
    
    Array(2).fill('').forEach(_ => lexer.nextToken() ) // consume all tokens
    expected = { text: '?invalid', value: null, type: 'UNKNOWN', whitespace: ' ' }
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
      const expected = { text: '=', value: null, type: 'EQUALS', whitespace }
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
    expected = { text: ',', value: null, type: 'COMMA', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: ',', value: null, type: 'COMMA', whitespace: ' ' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: ',', value: null, type: 'COMMA', whitespace: '' }
    expect(token._repr()).toEqual(expected)
  })

  test('token LPAREN', () => {
    let token, expected
    const input = '=SUM(5) + (6+  (7))'
    const lexer = new Lexer(input, GRAMMAR)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '(', value: null, type: 'LPAREN', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '(', value: null, type: 'LPAREN', whitespace: ' ' }
    expect(token._repr()).toEqual(expected)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '(', value: null, type: 'LPAREN', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token RPAREN', () => {
    const input = '=(5) + 8+(5  ) +8'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: ')', value: null, type: 'RPAREN', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(5).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: ')', value: null, type: 'RPAREN', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token COLON', () => {
    let token, expected
    const input = '=SUM(B2:D4)*sum(BC45  : Z5)'
    let lexer = new Lexer(input, GRAMMAR)

    Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: ':', value: null, type: 'COLON', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(6).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: ':', value: null, type: 'COLON', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token PLUS', () => {
    const input = '=5+3  + 3'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '+', value: null, type: 'PLUS', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '+', value: null, type: 'PLUS', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token MINUS', () => {
    const input = '=5-3  - 7'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '-', value: null, type: 'MINUS', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '-', value: null, type: 'MINUS', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token DIV', () => {
    const input = '=5/3  / 7'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '/', value: null, type: 'DIV', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '/', value: null, type: 'DIV', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token MULT', () => {
    const input = '=5*3  * 8'
    const lexer = new Lexer(input, GRAMMAR)
    let token, expected

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '*', value: null, type: 'MULT', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: '*', value: null, type: 'MULT', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  describe('token NUMBER', () => {
    it('parses integers', () => {
      const input = '=5 + 58 /(  23)'
      const lexer = new Lexer(input, GRAMMAR)
      let expected

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '5', value: null, type: 'NUMBER', whitespace: '' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '58', value: null, type: 'NUMBER', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '23', value: null, type: 'NUMBER', whitespace: '  ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)
    })

    it('parses floats', () => {
      let expected
      const input = '=5. + 58.3 /(  .23)/ 0.13.2.6'
      const lexer = new Lexer(input, GRAMMAR)
      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '5.', value: null, type: 'NUMBER', whitespace: '' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '58.3', value: null, type: 'NUMBER', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '.23', value: null, type: 'NUMBER', whitespace: '  ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '0.13.2.6', value: null, type: 'NUMBER', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)
    })
  })

  test('token CELL', () => {
    const input = '=5+B2 +  c3/(P3* cA25)'
    const lexer = new Lexer(input, GRAMMAR)
    let expected, token

    Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: 'B2', value: null, type: 'CELL', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: 'c3', value: null, type: 'CELL', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)

    Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: 'P3', value: null, type: 'CELL', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: 'cA25', value: null, type: 'CELL', whitespace: ' ' }
    expect(token._repr()).toEqual(expected)
  })

  test('token FUNCTION', () => {
    const input = '=5+SUM( sUm( 5)/  sum(5,8,9))'
    const lexer = new Lexer(input, GRAMMAR)
    let expected, token

    Array(3).fill('').forEach(_ => lexer.nextToken()) // skip to token
    token = lexer.nextToken()
    expected = { text: 'SUM', value: null, type: 'FUNCTION', whitespace: '' }
    expect(token._repr()).toEqual(expected)

    Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: 'sUm', value: null, type: 'FUNCTION', whitespace: ' ' }
    expect(token._repr()).toEqual(expected)

    Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
    token = lexer.nextToken()
    expected = { text: 'sum', value: null, type: 'FUNCTION', whitespace: '  ' }
    expect(token._repr()).toEqual(expected)
  })

  test('#getTokens', () => {
    const input = '=5+P7 /  SUM(  6,7, 8) * ( 125.2 / 58.45.4)'
    const lexer = new Lexer(input, GRAMMAR)
    const expected = [
      new Token('EQUALS', '=', ''),
      new Token('NUMBER', '5', ''),
      new Token('PLUS', '+', ''),
      new Token('CELL', 'P7', ''),
      new Token('DIV', '/', ' '),
      new Token('FUNCTION', 'SUM', '  '),
      new Token('LPAREN', '(', ''),
      new Token('NUMBER', '6', '  '),
      new Token('COMMA', ',', ''),
      new Token('NUMBER', '7', ''),
      new Token('COMMA', ',', ''),
      new Token('NUMBER', '8', ' '),
      new Token('RPAREN', ')', ''),
      new Token('MULT', '*', ' '),
      new Token('LPAREN', '(', ' '),
      new Token('NUMBER', '125.2', ' '),
      new Token('DIV', '/', ' '),
      new Token('NUMBER', '58.45.4', ' '),
      new Token('RPAREN', ')', ''),
    ]
    const tokens = lexer.getTokens()

    expect(tokens.length).toEqual(expected.length)

    expected.forEach((token, i) => {
      expect(token._repr()).toEqual(tokens[i]._repr())
    })
  })
})
