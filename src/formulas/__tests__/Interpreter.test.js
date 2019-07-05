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

  describe('#getAST', () => {
    it('gets expression AST', () => {
      const entered = '=sqrt(9)'
      const interpreter = new Interpreter(location)
      const ast = interpreter.getAST(entered)
      expect(ast).toMatchSnapshot()
    })

    it('throws error if expression is invalid', () => {
      const entered = '=sqrt(9'
      const interpreter = new Interpreter(location)
      expect(() => interpreter.getAST(entered)).toThrow(ERR_GENERIC)
    })
  })

  describe('#visitAST', () => {
    it('returns error message if vertex is missing AST', () => {
      const entered = '=sqrt(9'
      const interpreter = new Interpreter(location)

      graph.addVertex(location, entered)
      expect(interpreter.visitAST(location)).toEqual(ERR_GENERIC)
    })

    it('calls #visitNode', () => {
      const entered = '=sqrt(9)'
      const interpreter = new Interpreter(location)

      graph.addVertex(location, entered)
      jest.spyOn(interpreter, 'visitNode')
      interpreter.visitAST(location)
      expect(interpreter.visitNode).toHaveBeenCalled()
    })

    it('returns result', () => {
      const entered = '=sqrt(9)'
      const interpreter = new Interpreter(location)

      graph.addVertex(location, entered)
      expect(interpreter.visitAST(location)).toEqual(3)
    })
  })

  describe('#visitNode', () => {
    it('visits NumberNode', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'NumberNode')
      graph.addVertex(location, '=5')
      expect(interpreter.NumberNode).toHaveBeenCalledTimes(1)
    })

    it('visits CellNode', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'CellNode')
      graph.addVertex('A-2', '5')
      graph.addVertex(location, '=A2 + 6')
      expect(interpreter.CellNode).toHaveBeenCalledTimes(1)
    })

    it('visits TextNode', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'TextNode')
      graph.addVertex(location, '"hi"')
      expect(interpreter.TextNode).toHaveBeenCalledTimes(1)
    })

    it('visits StringNode', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'StringNode')
      graph.addVertex(location, '=concat("hi")')
      expect(interpreter.StringNode).toHaveBeenCalledTimes(1)
    })

    it('visits CellRange', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'CellRange')
      graph.addVertex(location, '=sum(B1:C3)')
      expect(interpreter.CellRange).toHaveBeenCalledTimes(1)
    })

    it('visits FuncOp', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'FuncOp')
      graph.addVertex(location, '=sum(5)')
      expect(interpreter.FuncOp).toHaveBeenCalledTimes(1)
    })

    it('visits BinaryOp', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'BinaryOp')
      graph.addVertex(location, '=5+2')
      expect(interpreter.BinaryOp).toHaveBeenCalledTimes(1)
    })

    it('visits UnaryOp', () => {
      const interpreter = new Interpreter(location)
      jest.spyOn(Interpreter.prototype, 'UnaryOp')
      graph.addVertex(location, '=5+-2')
      expect(interpreter.UnaryOp).toHaveBeenCalledTimes(1)
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
        const { result } = graph.addVertex(location, input)
        expect(result).toBe(input)
      })

      test('  5 ', () => {
        const input = '  5 '
        const { result } = graph.addVertex(location, input)
        expect(result).toBe(input)
      })

      test('=5', () => {
        const input = '=5'
        const { result } = graph.addVertex(location, input)
        expect(result).toBe(5)
      })

      test('=5 + -4 * (3 + -1)', () => {
        const input = '=5 + -4 * (3 + -1)'
        const { result } = graph.addVertex(location, input)
        expect(result).toBe(-3)
      })

      test('=( 5 + 2) * 3', () => {
        const input = '=( 5 + 2) * 3'
        const { result } = graph.addVertex(location, input)
        expect(result).toBe(21)
      })

      test('=3 + sum(  6, 3,1) - 5', () => {
        const input = '=3 + sum(  6, 3,1) - 5'
        const { result } = graph.addVertex(location, input)
        expect(result).toBe(8)
      })
  
      test('=(sqrt(49) + 1) / sum(3,(70/10))', () => {
        const input = '=(sqrt(49) + 3) * sum(3,(70/10))'
        const { result } = graph.addVertex(location, input)
        expect(result).toBe(100)
      })
    })

    describe('no cell references error path', () => {
      test('=5/0', () => {
        const input = '=5/0'
        const vertex = graph.addVertex(location, input)
        expect(vertex.result).toBe(ERR_DIVISION_BY_ZERO)
        expect(vertex.error).toBeTruthy()
      })

      test('=(5+2))', () => {
        const input = '=(5+2))'
        const vertex = graph.addVertex(location, input)
        expect(vertex.result).toBe(ERR_GENERIC)
        expect(vertex.error).toBeTruthy()
      })

      test('=sum(5,-))', () => {
        const input = '=sum(5,-))'
        const vertex = graph.addVertex(location, input)
        expect(vertex.result).toBe(ERR_GENERIC)
        expect(vertex.error).toBeTruthy()
      })
    })

    describe('cell references happy path', () => {
      test('A1=4, B2=A1', () => {
        graph.addVertex('A-1', '4')
        const { result } = graph.addVertex('A-2', '=A1')
        expect(result).toBe(4)
      })

      test('A1="test", B1=A1, C1=B1', () => {
        const input = 'test'
        let result

        graph.addVertex('A-1', 'test')
        result = graph.addVertex('B-1', '=A1').result
        expect(result).toBe(input)
        result = graph.addVertex('C-1', '=B1').result
        expect(result).toBe(input)
      })

      test('A1=4, B1=A1, C1=B1', () => {
        graph.addVertex('A-1', '4')
        graph.addVertex('B-1', '=A1')
        const { result } = graph.addVertex('C-1', '=B1')
        expect(result).toBe(4)
      })

      test('A1=3, B1=A1, C1=A1+B1', () => {
        graph.addVertex('A-1', '3')
        graph.addVertex('B-1', '=A1')
        const { result } = graph.addVertex('C-1', '=A1+B1')
        expect(result).toBe(6)
      })

      test('dependent cells update their result', () => {
        graph.addVertex('A-1', '4')
        graph.addVertex('A-2', '=A1 + 5')
        graph.addVertex('A-3', '=A2 + 3')
        expect(graph.getCellResult('A-2')).toBe(9)
        expect(graph.getCellResult('A-3')).toBe(12)

        graph.addVertex('A-1', '3')
        expect(graph.getCellResult('A-2')).toBe(8)
        expect(graph.getCellResult('A-3')).toBe(11)
      })

      test('A1=3, A3=2, C1=SUM(A1:A3)', () => {
        graph.addVertex('A-1', '3')
        graph.addVertex('A-3', '2')
        const { result } = graph.addVertex('C-1', '=SUM(A1:A3)')
        expect(result).toBe(5)
      })

      test('A1=3, C2=A1+1, C1=SUM(A1:B2,C2,(C3+9)/3)', () => {
        graph.addVertex('A-1', '3')
        graph.addVertex('C-2', '=A1+1')
        const { result } = graph.addVertex('C-1', '=SUM(A1:B2,C2,(C3+9)/3)')
        expect(result).toBe(10)
      })

      test('A1=CONCAT(" one ", "two")', () => {
        const { result } = graph.addVertex('A-1', '=CONCAT(" one ", "two")')
        expect(result).toBe(" one two")
      })
    })

    describe('cell references error path', () => {
      it('updates cells with errors ', () => {
        graph.addVertex('A-1', '=invalid')
        graph.addVertex('B-1', '=A1')
        expect(graph.getCellResult('A-1')).toBe(ERR_GENERIC)
        expect(graph.getCellResult('B-1')).toBe(ERR_GENERIC)

        graph.addVertex('A-1', '=7')
        expect(graph.getCellResult('A-1')).toBe(7)
        expect(graph.getCellResult('B-1')).toBe(7)
      })

      test('out of bounds error', () => {
        let vertex

        vertex = graph.addVertex(location, '=a10000')
        expect(vertex.result).toBe(ERR_GENERIC)
        expect(vertex.error.message).toMatch(/out of bounds/i)

        vertex = graph.addVertex(location, '=aaa1')
        expect(vertex.result).toBe(ERR_GENERIC)
        expect(vertex.error.message).toMatch(/out of bounds/i)

        vertex = graph.addVertex(location, '=aaa10000')
        expect(vertex.result).toBe(ERR_GENERIC)
        expect(vertex.error.message).toMatch(/out of bounds/i)
      })

      test('cache', () => {
        graph.addVertex('B-1', '2')
        jest.spyOn(graph, 'visitCell')
        graph.addVertex('A-1', '=B1+B1+B1')
        expect(graph.visitCell).toHaveBeenCalledTimes(1)
        expect(graph.getCellResult('A-1')).toBe(6)
      })

      describe('circular reference', () => {
        test('A1=A1', () => {
          const { result } = graph.addVertex(location, '=A1')
          expect(result).toBe(ERR_CIRCULAR_REFERENCE)
        })
  
        test('A1=B2, B2=A1', () => {
          graph.addVertex(location, '=B2')
          const { result } = graph.addVertex('B-2', '=A1')
          expect(result).toBe(ERR_CIRCULAR_REFERENCE)
        })
      })
    })
  })
})
