import formulaFunctions from '../formulaFunctions'


const Fn = formulaFunctions

describe('formulaFunctions', () => {
  describe('AVERAGE', () => {
    it('returns average', () => {
      expect(Fn.AVERAGE.fn(1,2,3,4)).toBe(2.5)
    })

    it('throws error if no arguments', () => {
      expect(() => Fn.AVERAGE.fn()).toThrow()
    })

    it('throws error if argument is not a number', () => {
      expect(() => Fn.AVERAGE.fn(1,2,'3',4)).toThrow()
    })
  })

  describe('CONCAT', () => {
    it('concatenates arguments', () => {
      expect(Fn.CONCAT.fn('one ', ' two ', ' three')).toBe('one  two  three')
    })

    it('takes strings and numbers', () => {
      expect(Fn.CONCAT.fn('one', 2)).toBe('one2')
      expect(Fn.CONCAT.fn(7, 2)).toBe('72')
    })

    it('throws error if no arguments', () => {
      expect(() => Fn.CONCAT.fn()).toThrow()
    })
  })

  describe('COUNT', () => {
    it('counts arguments received', () => {
      expect(Fn.COUNT.fn()).toBe(0)
      expect(Fn.COUNT.fn(1,2)).toBe(2)
    })
  })

  describe('MAX', () => {
    it('returns max', () => {
      expect(Fn.MAX.fn(4,8,2)).toBe(8)
    })

    it('throws error if no arguments', () => {
      expect(() => Fn.MAX.fn()).toThrow()
    })

    it('throws error if an argument is not a number', () => {
      expect(() => Fn.MAX.fn('one', 2, 3)).toThrow()
    })
  })

  describe('MIN', () => {
    it('returns MIN', () => {
      expect(Fn.MIN.fn(4,8,2)).toBe(2)
    })

    it('throws error if no arguments', () => {
      expect(() => Fn.MIN.fn()).toThrow()
    })

    it('throws error if an argumetn is not a number', () => {
      expect(() => Fn.MIN.fn('one', 2, 3)).toThrow()
    })
  })

  describe('POWER', () => {
    it('raises number to exponent', () => {
      expect(Fn.POWER.fn(3, 3)).toBe(27)
    })

    it('throws error if argument count is not two', () => {
      expect(() => Fn.POWER.fn()).toThrow()
      expect(() => Fn.POWER.fn(3)).toThrow()
      expect(() => Fn.POWER.fn(3,3,3)).toThrow()
    })

    it('throws error if argument is not a number', () => {
      expect(() => Fn.AVERAGE.fn(1,'3')).toThrow()
    })
  })

  describe('SQRT', () => {
    it('returns square root', () => {
      expect(Fn.SQRT.fn(9)).toBe(3)
    })

    it('throws error if argument count is not one', () => {
      expect(() => Fn.SQRT.fn()).toThrow()
      expect(() => Fn.SQRT.fn(3,3)).toThrow()
    })

    it('throws error if argument is not a number', () => {
      expect(() => Fn.AVERAGE.fn('9')).toThrow()
    })
  })

  describe('SUM', () => {
    it('returns sum', () => {
      expect(Fn.SUM.fn(1,2,3,4)).toBe(10)
    })

    it('throws error if no arguments', () => {
      expect(() => Fn.SUM.fn()).toThrow()
    })

    it('throws error if argument is not a number', () => {
      expect(() => Fn.AVERAGE.fn(1,2,'3',4)).toThrow()
    })
  })

  describe('aliases', () => {
    test('AVG', () => {
      expect(Fn.AVG.fn(2,3,4)).toEqual(Fn.AVERAGE.fn(2,3,4))
    })

    test('POW', () => {
      expect(Fn.POW.fn(2,3)).toEqual(Fn.POWER.fn(2,3))
    })
  })
})
