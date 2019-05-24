import Lexer from '../Lexer'


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

describe('Lexer', () => {
  test('end of input', () => {
    const input = '=5'
    const lexer = new Lexer(input)
    Array(2).fill('').forEach(_ => lexer.nextToken() ) // consume all tokens
    const expected = { text: '<EOF>', value: null, type: '<EOF>', whitespace: '' }
    expect(lexer.nextToken()).toEqual(expected)
    expect(lexer.nextToken()).toEqual(expected)
  })

  describe('simple symbols', () => {
    test('=', () => {
      const cases = [
        ['=5+8', ''],
        ['  = 5 +8 ', '  '],
      ]

      cases.forEach(([input, whitespace]) => {
        let lexer = new Lexer(input)
        const token = lexer.nextToken()
        const expected = { text: '=', value: null, type: 'EQUALS', whitespace }
        expect(token._repr()).toEqual(expected)
      })
    })

    test(',', () => {
      let token, expected
      const input = '=SUM(5  ,6 ,7,8)'
      const lexer = new Lexer(input)

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

    test('(', () => {
      let token, expected
      const input = '=SUM(5) + (6+  (7))'
      const lexer = new Lexer(input)

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

    test(')', () => {
      const cases = [
        ['=(5) + 8', ''],
        ['=(5  ) +8', '  '],
      ]

      cases.forEach(([input, whitespace]) => {
        let lexer = new Lexer(input)
        Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
        const token = lexer.nextToken()
        const expected = { text: ')', value: null, type: 'RPAREN', whitespace }
        expect(token._repr()).toEqual(expected)
      })
    })

    test(':', () => {
      let token, expected
      const input = '=SUM(B2:D4)*sum(BC45  : Z5)'
      let lexer = new Lexer(input)

      Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      token = lexer.nextToken()
      expected = { text: ':', value: null, type: 'COLON', whitespace: '' }
      expect(token._repr()).toEqual(expected)

      Array(6).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      token = lexer.nextToken()
      expected = { text: ':', value: null, type: 'COLON', whitespace: '  ' }
      expect(token._repr()).toEqual(expected)
    })

    test('+', () => {
      const cases = [
        ['=5+3', ''],
        ['= 5  + 3', '  '],
      ]

      cases.forEach(([input, whitespace]) => {
        let lexer = new Lexer(input)
        Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
        const token = lexer.nextToken()
        const expected = { text: '+', value: null, type: 'PLUS', whitespace }
        expect(token._repr()).toEqual(expected)
      })
    })

    test('-', () => {
      const cases = [
        ['=5-3', ''],
        ['= 5  - 3', '  '],
      ]

      cases.forEach(([input, whitespace]) => {
        let lexer = new Lexer(input)
        Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
        const token = lexer.nextToken()
        const expected = { text: '-', value: null, type: 'MINUS', whitespace }
        expect(token._repr()).toEqual(expected)
      })
    })

    test('/', () => {
      const cases = [
        ['=5/3', ''],
        ['= 5  / 3', '  '],
      ]

      cases.forEach(([input, whitespace]) => {
        let lexer = new Lexer(input)
        Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
        const token = lexer.nextToken()
        const expected = { text: '/', value: null, type: 'DIV', whitespace }
        expect(token._repr()).toEqual(expected)
      })
    })

    test('*', () => {
      const cases = [
        ['=5*3', ''],
        ['= 5  * 3', '  '],
      ]

      cases.forEach(([input, whitespace]) => {
        let lexer = new Lexer(input)
        Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
        const token = lexer.nextToken()
        const expected = { text: '*', value: null, type: 'MULT', whitespace }
        expect(token._repr()).toEqual(expected)
      })
    })
  })

  describe('#tokenNUMBER', () => {
    it('parses integers correctly', () => {
      let expected
      const input = '=5 + 58 /(  23)/ 13'
      const lexer = new Lexer(input)
      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '5', value: 5, type: 'NUMBER', whitespace: '' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '58', value: 58, type: 'NUMBER', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '23', value: 23, type: 'NUMBER', whitespace: '  ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '13', value: 13, type: 'NUMBER', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)
    })

    it('parses floats correctly', () => {
      let expected
      const input = '=5. + 58.3 /(  .23)/ 0.13'
      const lexer = new Lexer(input)
      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '5', value: 5, type: 'NUMBER', whitespace: '' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '58.3', value: 58.3, type: 'NUMBER', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '.23', value: 0.23, type: 'NUMBER', whitespace: '  ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      expected = { text: '0.13', value: 0.13, type: 'NUMBER', whitespace: ' ' }
      expect(lexer.nextToken()._repr()).toEqual(expected)
    })

    it('drops trailing dot', () => {
      const input = '=5. + 6'
      const lexer = new Lexer(input)
      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      const expected = { text: '5', value: 5, type: 'NUMBER', whitespace: '' }
      expect(lexer.nextToken()._repr()).toEqual(expected)
    })

    it('throws error if number is invalid', () => {
      const cases = [
        '=5+.',
        '=5+..',
        '=5+..2',
        '=5+2.3.4',
        '=5+2..4',
        '=5+2..',
        '=5+2...',
      ]

      expect.extend(toThrowWithMsg)

      cases.forEach(input => {
        let lexer = new Lexer(input)
        Array(3).fill('').forEach(_ => lexer.nextToken()) // skip to token
        expect({ input, func: () => lexer.nextToken() }).toThrowWithMsg()
      })
    })
  })

  describe('#tokenCELL', () => {
    it('returns cell token', () => {
      const input = '=5+B2 +  c3/(P3* cA25)'
      const lexer = new Lexer(input)
      let expected, token

      Array(3).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      token = lexer.nextToken()
      expected = { text: 'B2', value: 'B-2', type: 'CELL', whitespace: '' }
      expect(token._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      token = lexer.nextToken()
      expected = { text: 'C3', value: 'C-3', type: 'CELL', whitespace: '  ' }
      expect(token._repr()).toEqual(expected)

      Array(2).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      token = lexer.nextToken()
      expected = { text: 'P3', value: 'P-3', type: 'CELL', whitespace: '' }
      expect(token._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      token = lexer.nextToken()
      expected = { text: 'CA25', value: 'CA-25', type: 'CELL', whitespace: ' ' }
      expect(token._repr()).toEqual(expected)
    })
  })

  describe('#tokenFUNCTION', () => {
    it('returns function token', () => {
      const input = '=5+SUM( sUm( 5)/  sum(5,8,9))'
      const lexer = new Lexer(input)
      let expected, token

      Array(3).fill('').forEach(_ => lexer.nextToken()) // skip to token
      token = lexer.nextToken()
      expected = { text: 'SUM', value: null, type: 'FUNCTION', whitespace: '' }
      expect(token._repr()).toEqual(expected)

      Array(1).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      token = lexer.nextToken()
      expected = { text: 'SUM', value: null, type: 'FUNCTION', whitespace: ' ' }
      expect(token._repr()).toEqual(expected)

      Array(4).fill('').forEach(_ => lexer.nextToken() ) // skip to token
      token = lexer.nextToken()
      expected = { text: 'SUM', value: null, type: 'FUNCTION', whitespace: '  ' }
      expect(token._repr()).toEqual(expected)
    })

    it('throws error if function is invalid', () => {
      const cases = [
        '=2+SUMM(5, 6)',
        '=2+ suum(5, 6)',
        '=2+ SU M(5, 6)',
      ]

      expect.extend(toThrowWithMsg)

      cases.forEach(input => {
        const lexer = new Lexer(input)
        Array(3).fill('').forEach(_ => lexer.nextToken()) // skip to token
        expect({ input, func: () => lexer.nextToken() }).toThrowWithMsg()
      })
    })
  })
})

