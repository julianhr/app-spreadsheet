import graph from '../graph'
import Interpreter from '../Interpreter'


function interpret(location, formula) {
  const interpreter = new Interpreter(location)
  return interpreter.interpret(formula)
}

describe('graph', () => {
  beforeEach(() => {
    graph.resetAll()
  })

  test('#recalculate', () => {
    interpret('A-1', '=5+2')
    jest.spyOn(graph, 'setPendingNodes')
    jest.spyOn(graph, 'dfs')
    jest.spyOn(graph, 'updateStore')

    graph.recalculate('A-1')
    expect(graph.setPendingNodes).toHaveBeenCalledTimes(1)
    expect(graph.dfs).toHaveBeenCalledTimes(1)
    expect(graph.updateStore).toHaveBeenCalledTimes(1)
  })

  describe('#getCellResult', () => {
    it('returns value if vertex exists', () => {
      interpret('A-1', '=5+2')
      expect(graph.getCellResult('A-1')).toBe(7)
    })

    it('returns empty string if vertex does not exist', () => {
      expect(graph.getCellResult('A-1')).toBe('')
    })
  })

  test('#setPendingNodes', () => {
    interpret('A-1', '=5+2')
    interpret('A-2', '=A1+3')
    interpret('B-2', '5')
    graph.setPendingNodes()
    expect(graph.pending).toEqual(new Set(['A-1', 'A-2', 'B-2']))
  })
})
