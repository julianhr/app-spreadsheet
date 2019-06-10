import LexerRule from '../LexerRule'


describe('Rule', () => {
  it('instantiates correctly', () => {
    const regex = /[a-z]+/gi
    const groupIndex = 0
    const token = 'TEST'
    const rule = new LexerRule(regex, groupIndex, token)

    expect(rule.regex).toEqual(regex)
    expect(rule.groupIndex).toEqual(groupIndex)
    expect(rule.token).toEqual(token)
  })

  it('sets regex last index', () => {
    const rule = new LexerRule(/[a-z]+/gi, 0, 'TEST')
    rule.setIndex(10)
    expect(rule.regex.lastIndex).toEqual(10)
  })

  it('executes regex match', () => {
    const input = '1234 test 5678'
    const rule = new LexerRule(/[a-z]+/gi, 0, 'TEST')
    const match = rule.test(input)
    expect(match.index).toEqual(5)
    expect(match[0]).toEqual('test')
  })
})
