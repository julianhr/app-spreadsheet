import Token from '../Token'


describe('Token', () => {
  it('instantiates correctly', () => {
    const args = {
      type: 'test type',
      text: 'test text',
      whitespace: '  ',
      value: 'test value',
    }

    const token = new Token(...Object.values(args))
    expect(token._repr()).toEqual(args)
  })
})
