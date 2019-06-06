import graph from '../graph'
import Interpreter from '../Interpreter'


describe('graph', () => {
  beforeEach(() => {
    graph.resetAll()
  })

  test('#interpret ', () => {
    jest.spyOn(Interpreter.prototype, 'interpret')
    const result = graph.interpret('A-1', '=5+2')
    expect(result).toBe(7)
    expect(Interpreter.prototype.interpret).toHaveBeenCalledTimes(1)
  })

  test('#recalculate', () => {
    graph.interpret('A-1', '=5+2')
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
      graph.interpret('A-1', '=5+2')
      expect(graph.getCellResult('A-1')).toBe(7)
    })

    it('returns empty string if vertex does not exist', () => {
      expect(graph.getCellResult('A-1')).toBe('')
    })
  })

  test('#setPendingNodes', () => {
    graph.interpret('A-1', '=5+2')
    graph.interpret('A-2', '=A1+3')
    graph.interpret('B-2', '5')
    graph.setPendingNodes()
    expect(graph.pending).toEqual(new Set(['A-1', 'A-2', 'B-2']))
  })

  describe('#isResolved', () => {
    it('identifies if vertex was already processed during graph recalculation', () => {
      graph.interpret('A-1', '5')
      graph.interpret('A-2', '=A1')
      graph.interpret('A-3', '=A1')
      graph.interpret('B-3', '=A1')
      jest.spyOn(graph, 'isResolved')

      graph.recalculate('A-2')
      const mockResults = []
      graph.isResolved.mock.calls.forEach((call, i) =>
        mockResults.push([call[0], graph.isResolved.mock.results[i]]))
      expect(mockResults).toMatchSnapshot()
    })
  })
})
