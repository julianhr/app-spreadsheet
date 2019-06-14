import graph from '../graph'
import Interpreter, {
  ERR_DIVISION_BY_ZERO,
  ERR_CIRCULAR_REFERENCE,
  ERR_GENERIC,
} from '../Interpreter'


const location = 'A-1'

describe('Interpreter', () => {
  beforeEach(() => {
    graph.resetAll()
    jest.spyOn(graph, 'updateStore').mockReturnValue(null)
  })

  describe('#_visit', () => {
    it('visits NumberNode', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'NumberNode')
      interpreter.interpret('=5')
      expect(interpreter.NumberNode).toHaveBeenCalledTimes(1)
    })

    it('visits FuncOp', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'FuncOp')
      interpreter.interpret('=sum(5)')
      expect(interpreter.FuncOp).toHaveBeenCalledTimes(1)
    })

    it('visits BinaryOp', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'BinaryOp')
      interpreter.interpret('=5+2')
      expect(interpreter.BinaryOp).toHaveBeenCalledTimes(1)
    })

    it('throws error if node is unrecognized', () => {
      const interpreter = new Interpreter('A-1')
      class Test {}
      const node = new Test()
      expect(() => interpreter.visitNode(node)).toThrow()
    })
  })

  describe('#interpret', () => {
    describe('no cell references happy path ', () => {
      test('  testing ', () => {
        const input = '  testing '
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(input)
      })

      test('  5 ', () => {
        const input = '  5 '
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(input)
      })

      test('=5', () => {
        const input = '=5'
        const interpreter = new Interpreter(location)
        const result = interpreter.interpret(input)
        expect(result).toBe(5)
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

    describe('no cell references error path', () => {
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

    describe('cell references happy path', () => {
      test('A1=4, B2=A1', () => {
        const a1 = new Interpreter('A-1')
        const b2 = new Interpreter('B-2')
        a1.interpret('4')
        const result = b2.interpret('=A1')
        expect(result).toBe(4)
      })

      test('A1="test", B1=A1, C1=B1', () => {
        const input = 'test'
        const a1 = new Interpreter('A-1')
        const b1 = new Interpreter('B-1')
        const c1 = new Interpreter('C-1')
        let result

        a1.interpret('test')
        result = b1.interpret('=A1')
        expect(result).toBe(input)
        result = c1.interpret('=B1')
        expect(result).toBe(input)
      })

      test('A1=4, B1=A1, C1=B1', () => {
        const a1 = new Interpreter('A-1')
        const b1 = new Interpreter('B-1')
        const c1 = new Interpreter('C-1')

        a1.interpret('4')
        b1.interpret('=A1')
        const result = c1.interpret('=B1')
        expect(result).toBe(4)
      })

      test('A1=3, B1=A1, C1=A1+B1', () => {
        const a1 = new Interpreter('A-1')
        const b1 = new Interpreter('B-1')
        const c1 = new Interpreter('C-1')

        a1.interpret('3')
        b1.interpret('=A1')
        const result = c1.interpret('=A1+B1')
        expect(result).toBe(6)
      })

      test('dependent cells update their result', () => {
        const a1 = new Interpreter('A-1')
        const a2 = new Interpreter('A-2')
        const a3 = new Interpreter('A-3')

        a1.interpret('4')
        a2.interpret('=A1 + 5')
        a3.interpret('=A2 + 3')
        expect(graph.getCellResult('A-2')).toBe(9)
        expect(graph.getCellResult('A-3')).toBe(12)

        a1.interpret('3')
        expect(graph.getCellResult('A-2')).toBe(8)
        expect(graph.getCellResult('A-3')).toBe(11)
      })

      test('A1=3, A3=2, C1=SUM(A1:A3)', () => {
        const a1 = new Interpreter('A-1')
        const a3 = new Interpreter('A-3')
        const c1 = new Interpreter('C-1')

        a1.interpret('3')
        a3.interpret('2')
        const result = c1.interpret('=SUM(A1:A3)')
        expect(result).toBe(5)
      })

      test('A1=3, C2=A1+1, C1=SUM(A1:B2,C2,(C3+9)/3)', () => {
        const a1 = new Interpreter('A-1')
        const c2 = new Interpreter('C-2')
        const c1 = new Interpreter('C-1')

        a1.interpret('3')
        c2.interpret('=A1+1')
        const result = c1.interpret('=SUM(A1:B2,C2,(C3+9)/3)')
        expect(result).toBe(10)
      })

      test('A1=CONCAT(" one ", "two")', () => {
        const a1 = new Interpreter('A-1')
        const result = a1.interpret('=CONCAT(" one ", "two")')
        expect(result).toBe(" one two")
      })
    })

    describe('cell references error path', () => {
      it('updates cells with errors ', () => {
        const a1 = new Interpreter('A-1')
        const b1 = new Interpreter('B-1')
        a1.interpret('=invalid')
        b1.interpret('=A1')
        expect(graph.getVertex('A-1').result).toBe(ERR_GENERIC)
        expect(graph.getVertex('B-1').result).toBe(ERR_GENERIC)

        a1.interpret('=7')
        expect(graph.getVertex('A-1').result).toBe(7)
        expect(graph.getVertex('B-1').result).toBe(7)
      })

      test('out of bounds error', () => {
        const a1 = new Interpreter('A-1')

        a1.interpret('=a10000')
        expect(a1.result).toBe(ERR_GENERIC)
        expect(a1.error.message).toMatch(/out of bounds/i)

        a1.interpret('=aaa1')
        expect(a1.result).toBe(ERR_GENERIC)
        expect(a1.error.message).toMatch(/out of bounds/i)

        a1.interpret('=aaa10000')
        expect(a1.result).toBe(ERR_GENERIC)
        expect(a1.error.message).toMatch(/out of bounds/i)
      })

      test('cache', () => {
        const a1 = new Interpreter('A-1')
        const b1 = new Interpreter('B-1')
        b1.interpret('2')
        jest.spyOn(graph, 'visitCell')
        a1.interpret('=B1+B1+B1')
        expect(graph.visitCell).toHaveBeenCalledTimes(1)
        expect(a1.result).toBe(6)
      })

      describe('circular reference', () => {
        test('A1=A1', () => {
          const a1 = new Interpreter('A-1')
          const result = a1.interpret('=A1')
          expect(result).toBe(ERR_CIRCULAR_REFERENCE)
        })
  
        test('A1=B2, B2=A1', () => {
          const a1 = new Interpreter('A-1')
          const b2 = new Interpreter('B-2')
          a1.interpret('=B2')
          const result = b2.interpret('=A1')
          expect(result).toBe(ERR_CIRCULAR_REFERENCE)
        })
      })
    })
  })
})
