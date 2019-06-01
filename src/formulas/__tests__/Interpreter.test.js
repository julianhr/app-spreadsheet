import Interpreter, {
  ERR_DIVISION_BY_ZERO,
  ERR_CIRCULAR_REFERENCE,
  ERR_GENERIC,
} from '../Interpreter'



const location = 'A-1'

describe('Interpreter', () => {
  describe('#_visit', () => {
    it('visits NumberNode', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(interpreter, 'NumberNode')
      interpreter.interpret('=5')
      expect(interpreter.NumberNode).toHaveBeenCalledTimes(1)
    })

    it('visits FuncOp', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(interpreter, 'FuncOp')
      interpreter.interpret('=sum(5)')
      expect(interpreter.FuncOp).toHaveBeenCalledTimes(1)
    })

    it('visits BinaryOp', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(interpreter, 'BinaryOp')
      interpreter.interpret('=5+2')
      expect(interpreter.BinaryOp).toHaveBeenCalledTimes(1)
    })

    it('throws error if node is unrecognized', () => {
      class Test {}
      const node = new Test()
      expect(() => Interpreter.prototype.visit(node)).toThrow()
    })
  })

  describe('#interpret', () => {
    describe('happy path', () => {
      test('=5', () => {
        const input = '=5'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(5)
      })
  
      test('=5+ 2', () => {
        const input = '=5+ 2'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(7)
      })

      test('=5 + -4 * (3 + -1)', () => {
        const input = '=5 + -4 * (3 + -1)'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(-3)
      })

      test('=( 5 + 2) * 3', () => {
        const input = '=( 5 + 2) * 3'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(21)
      })

      test('=3 + sum(  6, 3,1) - 5', () => {
        const input = '=3 + sum(  6, 3,1) - 5'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(8)
      })
  
      test('=(sqrt(49) + 1) / sum(3,(70/10))', () => {
        const input = '=(sqrt(49) + 3) * sum(3,(70/10))'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(100)
      })
    })

    describe('error path', () => {
      test('=5/0', () => {
        const input = '=5/0'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(ERR_DIVISION_BY_ZERO)
        expect(interpreter.error).toBeTruthy()
      })

      test('=(5+2))', () => {
        const input = '=(5+2))'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(ERR_GENERIC)
        expect(interpreter.error).toBeTruthy()
      })

      test('=sum(5,-))', () => {
        const input = '=sum(5,-))'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(ERR_GENERIC)
        expect(interpreter.error).toBeTruthy()
      })
    })
  })
})
