import Interpreter from '../Interpreter'


describe('Interpreter', () => {
  describe('#visit', () => {
    it('visits NumberNode', () => {
      const interpreter = new Interpreter('=5')
      jest.spyOn(interpreter, 'NumberNode')
      interpreter.interpret()
      expect(interpreter.NumberNode).toHaveBeenCalledTimes(1)
    })

    it('visits FuncOp', () => {
      const interpreter = new Interpreter('=sum(5)')
      jest.spyOn(interpreter, 'FuncOp')
      interpreter.interpret()
      expect(interpreter.FuncOp).toHaveBeenCalledTimes(1)
    })

    it('visits BinaryOp', () => {
      const interpreter = new Interpreter('=5+2')
      jest.spyOn(interpreter, 'BinaryOp')
      interpreter.interpret()
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
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBe(5)
      })
  
      test('=5+ 2', () => {
        const input = '=5+ 2'
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBe(7)
      })

      test('=5 + -4 * (3 + -1)', () => {
        const input = '=5 + -4 * (3 + -1)'
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBe(-3)
      })

      test('=( 5 + 2) * 3', () => {
        const input = '=( 5 + 2) * 3'
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBe(21)
      })

      test('=3 + sum(  6, 3,1) - 5', () => {
        const input = '=3 + sum(  6, 3,1) - 5'
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBe(8)
      })
  
      test('=(sqrt(49) + 1) / sum(3,(70/10))', () => {
        const input = '=(sqrt(49) + 3) * sum(3,(70/10))'
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBe(100)
      })
    })

    describe('error path', () => {
      test('=5/0', () => {
        const input = '=5/0'
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBeNull()
        expect(interpreter.error.message).toBe('Division by zero: 5/0')
      })

      test('=(5+2))', () => {
        const input = '=(5+2))'
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBeNull()
        expect(interpreter.error).toBeTruthy()
      })

      test('=sum(5,-))', () => {
        const input = '=sum(5,-))'
        const interpreter = new Interpreter(input)
        const result = interpreter.interpret()
        expect(result).toBeNull()
        expect(interpreter.error).toBeTruthy()
      })
    })
  })
})
