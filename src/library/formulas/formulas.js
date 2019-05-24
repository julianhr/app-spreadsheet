const formulas = {}

formulas.SUM = (...args) => (args.reduce((prev, curr) => (prev + curr)))

formulas.TODAY = () => (new Date.now())

formulas.CONCAT = (...args) => (args.reduce((prev, curr) => (prev + curr), ''))

formulas.MAX = (...args) => (Math.max(args))

formulas.MIN = (...args) => (Math.min(args))

formulas.AVERAGE = (...args) => (this.SUM(args) / this.COUNT(args))

formulas.COUNT = (...args) => (args.length)

formulas.POWER = (base, exponent) => (Math.pow(base, exponent))

// aliases
formulas.POW = formulas.POWER

export default formulas