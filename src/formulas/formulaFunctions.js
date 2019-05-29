const fn = {
  AVERAGE: function(...args) {
    if (args.length === 0) {
      throw new Error('Empty elements')
    }

    return this.SUM(...args) / this.COUNT(...args)
  },

  CONCAT: function(...args) {
    if (args.length === 0) {
      throw new Error('Empty elements')
    }

    return args.reduce((prev, curr) => (prev + curr), '')
  },

  COUNT: (...args) => args.length,

  MAX: function(...args) {
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

  MIN: function(...args) {
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

  POWER: function(...args) {
    if (args.length !== 2) {
      throw new Error('Formula takes only two elements')
    }
  
    const [base, exp] = args
    return Math.pow(base, exp)
  },

  SQRT: function(...args) {
    if (args.length !== 1) {
      throw new Error(`Formula takes only one element`)
    }

    return Math.sqrt(args[0])
  },

  SUM: function(...args) {
    if (args.length === 0) {
      throw new Error('Empty elements')
    }

    return args.reduce((prev, curr) => prev + curr)
  },
}

// aliases
fn.POW = fn.POWER

export default fn
