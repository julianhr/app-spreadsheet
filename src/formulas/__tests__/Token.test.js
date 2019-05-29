import Token from '../Token'


describe('Token', () => {
  it('instantiates correctly', () => {
    const args = {
      type: 'test type',
      text: 'test text',
      whitespace: '  ',
    }
    const repr = { ...args }

    const token = new Token(...Object.values(args))
    expect(token._repr()).toEqual(repr)
  })
})
