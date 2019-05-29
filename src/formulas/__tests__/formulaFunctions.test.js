import formulaFn from '../formulaFunctions'


const fn = formulaFn

describe('formulaFunctions', () => {
  describe('AVERAGE', () => {
    it('returns average', () => {
      expect(fn.AVERAGE(1,2,3,4)).toBe(2.5)
    })

    it('throws error if no arguments', () => {
      expect(() => fn.AVERAGE()).toThrow()
    })
  })

  describe('CONCAT', () => {
    it('concatenates arguments', () => {
      expect(fn.CONCAT('one', 'two', 'three')).toBe('onetwothree')
    })

    it('takes strings and numbers', () => {
      expect(fn.CONCAT('one', 2)).toBe('one2')
      expect(fn.CONCAT(7, 2)).toBe('72')
    })

    it('throws error if no arguments', () => {
      expect(() => fn.CONCAT()).toThrow()
    })
  })

  describe('COUNT', () => {
    it('counts arguments received', () => {
      expect(fn.COUNT()).toBe(0)
      expect(fn.COUNT(1,2)).toBe(2)
    })
  })

  describe('MAX', () => {
    it('returns max', () => {
      expect(fn.MAX(4,8,2)).toBe(8)
    })

    it('throws error if no arguments', () => {
      expect(() => fn.MAX()).toThrow()
    })

    it('throws error if an argumetn is not a number', () => {
      expect(() => fn.MAX('one', 2, 3)).toThrow()
    })
  })

  describe('MIN', () => {
    it('returns MIN', () => {
      expect(fn.MIN(4,8,2)).toBe(2)
    })

    it('throws error if no arguments', () => {
      expect(() => fn.MIN()).toThrow()
    })

    it('throws error if an argumetn is not a number', () => {
      expect(() => fn.MIN('one', 2, 3)).toThrow()
    })
  })

  describe('POWER', () => {
    it('raises number to exponent', () => {
      expect(fn.POWER(3, 3)).toBe(27)
    })

    it('throws error if argument count is not two', () => {
      expect(() => fn.POWER()).toThrow()
      expect(() => fn.POWER(3)).toThrow()
      expect(() => fn.POWER(3,3,3)).toThrow()
    })
  })

  describe('SQRT', () => {
    it('returns square root', () => {
      expect(fn.SQRT(9)).toBe(3)
    })

    it('throws error if argument count is not one', () => {
      expect(() => fn.SQRT()).toThrow()
      expect(() => fn.SQRT(3,3)).toThrow()
    })
  })

  describe('SUM', () => {
    it('returns sum', () => {
      expect(fn.SUM(1,2,3,4)).toBe(10)
    })

    it('throws error if no arguments', () => {
      expect(() => fn.SUM()).toThrow()
    })
  })

  describe('POW', () => {
    test('POW is an alias of POWER', () => {
      expect(fn.POW(2,3)).toEqual(fn.POWER(2,3))
    })
  })
})
