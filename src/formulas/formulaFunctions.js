const Fn = {
  AVERAGE: {
    fn: (...args) => {
      if (args.length === 0) {
        throw new Error('Empty elements')
      }
  
      return Fn.SUM.fn(...args) / Fn.COUNT.fn(...args)
    },
    definition: 'AVERAGE(value1, value2, ...)',
    example: 'AVERAGE(A1:B3, 3)',
    summary: 'Returns the average from a series of numbers.',
  },
  CONCAT: {
    fn: (...args) => {
      if (args.length === 0) {
        throw new Error('Empty elements')
      }
  
      return args.reduce((prev, curr) => (prev + curr), '')
    },
    definition: 'CONCAT("text1", "text2", ...)',
    example: 'CONCAT("one", "two")',
    summary: 'Returns a single concatenated string from a series of strings.',
  },
  COUNT: {
    fn: (...args) => args.length,
    definition: 'COUNT(element1, element2, ...)',
    example: 'COUNT(A1:B3, 2, C4)',
    summary: 'Returns the number of non-empty elements in a set.',
  },
  MAX: {
    fn: (...args) => {
      if (args.length === 0) {
        throw new Error('Empty elements')
      }
  
      args.forEach(arg => {
        if (typeof arg !== 'number') {
          throw new TypeError(`${arg} is not a number`)
        }
      })
  
      return Math.max(...args)
    },
    definition: 'MAX(value1, value2, ...)',
    example: 'MAX(A1:B3, 4, C3)',
    summary: 'Returns the maximum value from a series of numbers',
  },
  MIN: {
    fn: (...args) => {
      if (args.length === 0) {
        throw new Error('Empty elements')
      }
  
      args.forEach(arg => {
        if (typeof arg !== 'number') {
          throw new TypeError(`${arg} is not a number`)
        }
      })
  
      return Math.min(...args)
    },
    definition: 'MIN(value1, value2, ...)',
    example: 'MIN(A1:B3, 4, C3)',
    summary: 'Returns the minimum value from a series of numbers.',
  },
  POWER: {
    fn: (...args) => {
      if (args.length !== 2) {
        throw new Error('Formula takes only two elements')
      }
    
      const [base, exp] = args
      return Math.pow(base, exp)
    },
    definition: 'POWER(base, exponent)',
    example: 'POWER(A3,2)',
    summary: 'Returns a number raised to an exponent.'
  },
  SQRT: {
    fn: (...args) => {
      if (args.length !== 1) {
        throw new Error(`Formula takes only one element`)
      }
  
      return Math.sqrt(args[0])
    },
    definition: 'SQRT(value)',
    example: 'SQRT(9) or SQRT(A3)',
    summary: 'Returns the square root of a number.'
  },
  SUM: {
    fn: (...args) => {
      if (args.length === 0) {
        throw new Error('Empty elements')
      }
  
      return args.reduce((prev, curr) => prev + curr)
    },
    definition: 'SUM(value1, value2, ...)',
    example: 'SUM(A1:B3, 3, C5)',
    summary: 'Retuns the sum from a series of numbers.',
  }
}

// aliases
Fn.AVG = {
  ...Fn.AVERAGE,
  definition: 'AVG(value1, value2, ...)',
  example: 'AVG(A1:B3, 3)',
}

Fn.POW = {
  ...Fn.POWER,
  definition: 'POW(base, exponent)',
  example: 'POW(A3,2)',
}

export default Fn
