import Token from '../Token'


describe('Token', () => {
  it('instantiates correctly', () => {
    const type = 'NUMBER'
    const text = '2'
    const whitespace = 1
    const category = 'entity'
    const index = 0

    const token = new Token(type, text, whitespace, category, index)
    expect(token).toMatchSnapshot()
  })
})
